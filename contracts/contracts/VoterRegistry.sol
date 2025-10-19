// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VoterRegistry
 * @dev Manages voter registration and verification
 */
contract VoterRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct Voter {
        bool isRegistered;
        bool isVerified;
        bytes32 identityHash; // Hash of off-chain identity
        uint256 registrationTime;
        string ipfsCID; // IPFS reference for encrypted identity data
    }

    mapping(address => Voter) public voters;
    mapping(bytes32 => bool) public usedIdentityHashes;
    
    uint256 public totalRegistered;
    uint256 public totalVerified;

    event VoterRegistered(address indexed voter, bytes32 identityHash, uint256 timestamp);
    event VoterVerified(address indexed voter, uint256 timestamp);
    event VoterRevoked(address indexed voter, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Register a new voter with identity hash
     * @param _identityHash Hash of voter's identity (e.g., keccak256(aadhaar))
     * @param _ipfsCID IPFS CID for encrypted identity data
     */
    function registerVoter(bytes32 _identityHash, string memory _ipfsCID) 
        external 
        nonReentrant 
    {
        require(!voters[msg.sender].isRegistered, "Already registered");
        require(!usedIdentityHashes[_identityHash], "Identity already used");
        require(_identityHash != bytes32(0), "Invalid identity hash");

        voters[msg.sender] = Voter({
            isRegistered: true,
            isVerified: false,
            identityHash: _identityHash,
            registrationTime: block.timestamp,
            ipfsCID: _ipfsCID
        });

        usedIdentityHashes[_identityHash] = true;
        totalRegistered++;

        emit VoterRegistered(msg.sender, _identityHash, block.timestamp);
    }

    /**
     * @dev Verify a registered voter (admin/verifier only)
     * @param _voter Address of voter to verify
     */
    function verifyVoter(address _voter) 
        external 
        onlyRole(VERIFIER_ROLE) 
    {
        require(voters[_voter].isRegistered, "Voter not registered");
        require(!voters[_voter].isVerified, "Already verified");

        voters[_voter].isVerified = true;
        totalVerified++;

        emit VoterVerified(_voter, block.timestamp);
    }

    /**
     * @dev Batch verify multiple voters
     * @param _voters Array of voter addresses to verify
     */
    function batchVerifyVoters(address[] calldata _voters) 
        external 
        onlyRole(VERIFIER_ROLE) 
    {
        for (uint256 i = 0; i < _voters.length; i++) {
            if (voters[_voters[i]].isRegistered && !voters[_voters[i]].isVerified) {
                voters[_voters[i]].isVerified = true;
                totalVerified++;
                emit VoterVerified(_voters[i], block.timestamp);
            }
        }
    }

    /**
     * @dev Revoke voter registration (admin only)
     * @param _voter Address of voter to revoke
     */
    function revokeVoter(address _voter) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(voters[_voter].isRegistered, "Voter not registered");

        if (voters[_voter].isVerified) {
            totalVerified--;
        }
        
        delete usedIdentityHashes[voters[_voter].identityHash];
        delete voters[_voter];
        totalRegistered--;

        emit VoterRevoked(_voter, block.timestamp);
    }

    /**
     * @dev Check if voter is registered and verified
     * @param _voter Address to check
     */
    function isEligibleVoter(address _voter) external view returns (bool) {
        return voters[_voter].isRegistered && voters[_voter].isVerified;
    }

    /**
     * @dev Get voter details
     * @param _voter Address to query
     */
    function getVoter(address _voter) 
        external 
        view 
        returns (
            bool isRegistered,
            bool isVerified,
            bytes32 identityHash,
            uint256 registrationTime,
            string memory ipfsCID
        ) 
    {
        Voter memory voter = voters[_voter];
        return (
            voter.isRegistered,
            voter.isVerified,
            voter.identityHash,
            voter.registrationTime,
            voter.ipfsCID
        );
    }
}
