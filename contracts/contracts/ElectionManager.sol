// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./VoterRegistry.sol";

/**
 * @title ElectionManager
 * @dev Manages elections, candidates, and voting process
 */
contract ElectionManager is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ELECTION_MANAGER_ROLE = keccak256("ELECTION_MANAGER_ROLE");

    enum ElectionStatus { Created, Active, Closed, Tallied }
    enum PrivacyMode { CommitOnly, CommitReveal, Homomorphic }

    struct Election {
        string name;
        string description;
        uint256 startTime;
        uint256 endTime;
        ElectionStatus status;
        PrivacyMode privacyMode;
        uint256 totalVotes;
        string ipfsCID; // Metadata on IPFS
        bool resultsPublished;
    }

    struct Candidate {
        uint256 id;
        string name;
        string description;
        string ipfsCID;
        uint256 voteCount; // Only revealed after tally
        bool exists;
    }

    struct Vote {
        bytes32 voteCommitment; // keccak256(candidateId, salt, voter)
        uint256 timestamp;
        bool revealed;
        uint256 revealedCandidateId;
    }

    VoterRegistry public voterRegistry;
    
    uint256 public electionCount;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates; // electionId => candidateId => Candidate
    mapping(uint256 => uint256) public candidateCounts; // electionId => count
    mapping(uint256 => mapping(address => Vote)) public votes; // electionId => voter => Vote
    mapping(uint256 => mapping(address => bool)) public hasVoted; // electionId => voter => bool

    event ElectionCreated(uint256 indexed electionId, string name, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
    event ElectionStarted(uint256 indexed electionId, uint256 timestamp);
    event ElectionClosed(uint256 indexed electionId, uint256 timestamp);
    event VoteSubmitted(uint256 indexed electionId, address indexed voter, bytes32 voteCommitment, uint256 timestamp);
    event VoteRevealed(uint256 indexed electionId, address indexed voter, uint256 candidateId);
    event ElectionTallied(uint256 indexed electionId, uint256 timestamp);
    event ResultsPublished(uint256 indexed electionId, uint256 timestamp);

    constructor(address _voterRegistry) {
        require(_voterRegistry != address(0), "Invalid registry address");
        voterRegistry = VoterRegistry(_voterRegistry);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ELECTION_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Create a new election
     */
    function createElection(
        string memory _name,
        string memory _description,
        uint256 _startTime,
        uint256 _endTime,
        PrivacyMode _privacyMode,
        string memory _ipfsCID
    ) external onlyRole(ELECTION_MANAGER_ROLE) returns (uint256) {
        require(_startTime > block.timestamp, "Start time must be in future");
        require(_endTime > _startTime, "End time must be after start time");
        require(bytes(_name).length > 0, "Name required");

        uint256 electionId = electionCount++;
        
        elections[electionId] = Election({
            name: _name,
            description: _description,
            startTime: _startTime,
            endTime: _endTime,
            status: ElectionStatus.Created,
            privacyMode: _privacyMode,
            totalVotes: 0,
            ipfsCID: _ipfsCID,
            resultsPublished: false
        });

        emit ElectionCreated(electionId, _name, _startTime, _endTime);
        return electionId;
    }

    /**
     * @dev Add candidate to election
     */
    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _description,
        string memory _ipfsCID
    ) external onlyRole(ELECTION_MANAGER_ROLE) {
        require(_electionId < electionCount, "Invalid election");
        require(elections[_electionId].status == ElectionStatus.Created, "Cannot add candidates now");
        require(bytes(_name).length > 0, "Name required");

        uint256 candidateId = candidateCounts[_electionId]++;
        
        candidates[_electionId][candidateId] = Candidate({
            id: candidateId,
            name: _name,
            description: _description,
            ipfsCID: _ipfsCID,
            voteCount: 0,
            exists: true
        });

        emit CandidateAdded(_electionId, candidateId, _name);
    }

    /**
     * @dev Start an election
     */
    function startElection(uint256 _electionId) 
        external 
        onlyRole(ELECTION_MANAGER_ROLE) 
    {
        require(_electionId < electionCount, "Invalid election");
        Election storage election = elections[_electionId];
        require(election.status == ElectionStatus.Created, "Election already started");
        require(block.timestamp >= election.startTime, "Too early to start");
        require(candidateCounts[_electionId] >= 2, "Need at least 2 candidates");

        election.status = ElectionStatus.Active;
        emit ElectionStarted(_electionId, block.timestamp);
    }

    /**
     * @dev Submit encrypted vote commitment
     */
    function submitVote(uint256 _electionId, bytes32 _voteCommitment) 
        external 
        nonReentrant 
    {
        require(_electionId < electionCount, "Invalid election");
        Election storage election = elections[_electionId];
        
        require(election.status == ElectionStatus.Active, "Election not active");
        require(block.timestamp >= election.startTime, "Election not started");
        require(block.timestamp <= election.endTime, "Election ended");
        require(!hasVoted[_electionId][msg.sender], "Already voted");
        require(voterRegistry.isEligibleVoter(msg.sender), "Not eligible to vote");
        require(_voteCommitment != bytes32(0), "Invalid commitment");

        votes[_electionId][msg.sender] = Vote({
            voteCommitment: _voteCommitment,
            timestamp: block.timestamp,
            revealed: false,
            revealedCandidateId: 0
        });

        hasVoted[_electionId][msg.sender] = true;
        election.totalVotes++;

        emit VoteSubmitted(_electionId, msg.sender, _voteCommitment, block.timestamp);
    }

    /**
     * @dev Reveal vote (for commit-reveal mode)
     */
    function revealVote(
        uint256 _electionId,
        uint256 _candidateId,
        bytes32 _salt
    ) external nonReentrant {
        require(_electionId < electionCount, "Invalid election");
        Election storage election = elections[_electionId];
        
        require(election.status == ElectionStatus.Closed, "Election not closed");
        require(election.privacyMode == PrivacyMode.CommitReveal, "Not commit-reveal mode");
        require(hasVoted[_electionId][msg.sender], "No vote to reveal");
        require(!votes[_electionId][msg.sender].revealed, "Already revealed");
        require(candidates[_electionId][_candidateId].exists, "Invalid candidate");

        // Verify commitment
        bytes32 expectedCommitment = keccak256(abi.encodePacked(_candidateId, _salt, msg.sender));
        require(votes[_electionId][msg.sender].voteCommitment == expectedCommitment, "Invalid reveal");

        votes[_electionId][msg.sender].revealed = true;
        votes[_electionId][msg.sender].revealedCandidateId = _candidateId;
        candidates[_electionId][_candidateId].voteCount++;

        emit VoteRevealed(_electionId, msg.sender, _candidateId);
    }

    /**
     * @dev Close election
     */
    function closeElection(uint256 _electionId) 
        external 
        onlyRole(ELECTION_MANAGER_ROLE) 
    {
        require(_electionId < electionCount, "Invalid election");
        Election storage election = elections[_electionId];
        
        require(election.status == ElectionStatus.Active, "Election not active");
        require(block.timestamp > election.endTime, "Election still ongoing");

        election.status = ElectionStatus.Closed;
        emit ElectionClosed(_electionId, block.timestamp);
    }

    /**
     * @dev Tally votes and publish results (simplified for commit-only mode)
     */
    function tallyElection(uint256 _electionId) 
        external 
        onlyRole(ELECTION_MANAGER_ROLE) 
    {
        require(_electionId < electionCount, "Invalid election");
        Election storage election = elections[_electionId];
        
        require(election.status == ElectionStatus.Closed, "Election not closed");
        require(!election.resultsPublished, "Already tallied");

        election.status = ElectionStatus.Tallied;
        election.resultsPublished = true;

        emit ElectionTallied(_electionId, block.timestamp);
        emit ResultsPublished(_electionId, block.timestamp);
    }

    /**
     * @dev Get election details
     */
    function getElection(uint256 _electionId) 
        external 
        view 
        returns (
            string memory name,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            ElectionStatus status,
            uint256 totalVotes,
            uint256 candidateCount
        ) 
    {
        require(_electionId < electionCount, "Invalid election");
        Election memory election = elections[_electionId];
        
        return (
            election.name,
            election.description,
            election.startTime,
            election.endTime,
            election.status,
            election.totalVotes,
            candidateCounts[_electionId]
        );
    }

    /**
     * @dev Get candidate details
     */
    function getCandidate(uint256 _electionId, uint256 _candidateId) 
        external 
        view 
        returns (
            string memory name,
            string memory description,
            uint256 voteCount,
            string memory ipfsCID
        ) 
    {
        require(_electionId < electionCount, "Invalid election");
        require(candidates[_electionId][_candidateId].exists, "Invalid candidate");
        
        Candidate memory candidate = candidates[_electionId][_candidateId];
        return (candidate.name, candidate.description, candidate.voteCount, candidate.ipfsCID);
    }

    /**
     * @dev Check if address has voted in election
     */
    function hasVotedInElection(uint256 _electionId, address _voter) 
        external 
        view 
        returns (bool) 
    {
        return hasVoted[_electionId][_voter];
    }

    /**
     * @dev Get vote commitment for verification
     */
    function getVoteCommitment(uint256 _electionId, address _voter) 
        external 
        view 
        returns (bytes32) 
    {
        require(hasVoted[_electionId][_voter], "No vote found");
        return votes[_electionId][_voter].voteCommitment;
    }
}
