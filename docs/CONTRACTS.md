# Smart Contract Specifications

## Overview

The DVS smart contracts are built with Solidity 0.8.20 and use OpenZeppelin libraries for security and access control.

## Contracts

### VoterRegistry.sol

**Purpose**: Manages voter registration and verification.

#### State Variables

```solidity
mapping(address => Voter) public voters;
mapping(bytes32 => bool) public usedIdentityHashes;
uint256 public totalRegistered;
uint256 public totalVerified;
```

#### Structs

```solidity
struct Voter {
    bool isRegistered;
    bool isVerified;
    bytes32 identityHash;
    uint256 registrationTime;
    string ipfsCID;
}
```

#### Functions

**registerVoter(bytes32 _identityHash, string memory _ipfsCID)**
- Registers a new voter with hashed identity
- Prevents duplicate registrations
- Emits `VoterRegistered` event
- Access: Public

**verifyVoter(address _voter)**
- Verifies a registered voter
- Only callable by verifier role
- Emits `VoterVerified` event
- Access: VERIFIER_ROLE

**batchVerifyVoters(address[] calldata _voters)**
- Verifies multiple voters in one transaction
- Gas-efficient for bulk operations
- Access: VERIFIER_ROLE

**revokeVoter(address _voter)**
- Revokes voter registration
- Only callable by admin
- Emits `VoterRevoked` event
- Access: ADMIN_ROLE

**isEligibleVoter(address _voter) returns (bool)**
- Checks if voter is registered and verified
- Used by ElectionManager before accepting votes
- Access: Public view

#### Events

```solidity
event VoterRegistered(address indexed voter, bytes32 identityHash, uint256 timestamp);
event VoterVerified(address indexed voter, uint256 timestamp);
event VoterRevoked(address indexed voter, uint256 timestamp);
```

#### Security Features

- ReentrancyGuard on state-changing functions
- Role-based access control
- Identity hash uniqueness enforcement
- No plaintext identity storage

---

### ElectionManager.sol

**Purpose**: Manages elections, candidates, and voting process.

#### State Variables

```solidity
VoterRegistry public voterRegistry;
uint256 public electionCount;
mapping(uint256 => Election) public elections;
mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
mapping(uint256 => mapping(address => Vote)) public votes;
mapping(uint256 => mapping(address => bool)) public hasVoted;
```

#### Enums

```solidity
enum ElectionStatus { Created, Active, Closed, Tallied }
enum PrivacyMode { CommitOnly, CommitReveal, Homomorphic }
```

#### Structs

```solidity
struct Election {
    string name;
    string description;
    uint256 startTime;
    uint256 endTime;
    ElectionStatus status;
    PrivacyMode privacyMode;
    uint256 totalVotes;
    string ipfsCID;
    bool resultsPublished;
}

struct Candidate {
    uint256 id;
    string name;
    string description;
    string ipfsCID;
    uint256 voteCount;
    bool exists;
}

struct Vote {
    bytes32 voteCommitment;
    uint256 timestamp;
    bool revealed;
    uint256 revealedCandidateId;
}
```

#### Functions

**createElection(...) returns (uint256)**
- Creates a new election
- Validates time parameters
- Returns election ID
- Access: ELECTION_MANAGER_ROLE

**addCandidate(uint256 _electionId, ...)**
- Adds candidate to election
- Only before election starts
- Emits `CandidateAdded` event
- Access: ELECTION_MANAGER_ROLE

**startElection(uint256 _electionId)**
- Starts an election
- Requires at least 2 candidates
- Must be at or past start time
- Changes status to Active
- Access: ELECTION_MANAGER_ROLE

**submitVote(uint256 _electionId, bytes32 _voteCommitment)**
- Submits encrypted vote commitment
- Validates voter eligibility
- Prevents double voting
- Emits `VoteSubmitted` event
- Access: Public (verified voters only)

**revealVote(uint256 _electionId, uint256 _candidateId, bytes32 _salt)**
- Reveals vote in commit-reveal mode
- Verifies commitment matches
- Updates candidate vote count
- Access: Public (voters who submitted commitment)

**closeElection(uint256 _electionId)**
- Closes election after end time
- Changes status to Closed
- Emits `ElectionClosed` event
- Access: ELECTION_MANAGER_ROLE

**tallyElection(uint256 _electionId)**
- Tallies votes and publishes results
- Only after election closed
- Emits `ElectionTallied` event
- Access: ELECTION_MANAGER_ROLE

#### View Functions

```solidity
function getElection(uint256 _electionId) external view returns (...)
function getCandidate(uint256 _electionId, uint256 _candidateId) external view returns (...)
function hasVotedInElection(uint256 _electionId, address _voter) external view returns (bool)
function getVoteCommitment(uint256 _electionId, address _voter) external view returns (bytes32)
```

#### Events

```solidity
event ElectionCreated(uint256 indexed electionId, string name, uint256 startTime, uint256 endTime);
event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);
event ElectionStarted(uint256 indexed electionId, uint256 timestamp);
event ElectionClosed(uint256 indexed electionId, uint256 timestamp);
event VoteSubmitted(uint256 indexed electionId, address indexed voter, bytes32 voteCommitment, uint256 timestamp);
event VoteRevealed(uint256 indexed electionId, address indexed voter, uint256 candidateId);
event ElectionTallied(uint256 indexed electionId, uint256 timestamp);
event ResultsPublished(uint256 indexed electionId, uint256 timestamp);
```

#### Security Features

- ReentrancyGuard on voting functions
- Voter eligibility checks via VoterRegistry
- Time-based access control
- Double voting prevention
- Commitment verification for reveals

---

## Privacy Modes

### Commit Only (Default)

- Voters submit encrypted commitments
- Votes are tallied off-chain
- Results published after verification
- Simplest implementation
- Suitable for most use cases

### Commit-Reveal

- Phase 1: Voters submit commitments
- Phase 2: Voters reveal their votes with salt
- Smart contract verifies and tallies
- Enhanced transparency
- Requires two transactions per voter

### Homomorphic (Advanced)

- Votes encrypted with homomorphic encryption
- Tallying performed on encrypted data
- Results decrypted after election
- Maximum privacy
- Complex implementation

## Vote Commitment Scheme

```solidity
// Generate commitment
bytes32 commitment = keccak256(abi.encodePacked(candidateId, salt, voterAddress));

// Verify commitment (reveal phase)
require(votes[electionId][msg.sender].voteCommitment == commitment, "Invalid reveal");
```

**Benefits**:
- Hides vote choice until reveal
- Prevents vote buying/coercion
- Cryptographically secure
- Verifiable by anyone

## Gas Optimization

1. **Batch Operations**: `batchVerifyVoters` for multiple verifications
2. **Storage Packing**: Efficient struct layouts
3. **View Functions**: Off-chain data queries
4. **Event Indexing**: Indexed parameters for filtering
5. **Minimal Storage**: Store hashes instead of full data

## Upgrade Strategy

Contracts use proxy pattern for upgradeability:
- Transparent proxy for admin functions
- UUPS proxy for voter-facing functions
- Time-locked upgrades for security
- Multi-sig for upgrade approval

## Testing

### Test Coverage

- Unit tests for all functions
- Integration tests for workflows
- Edge case testing
- Gas usage analysis
- Security audit tests

### Test Networks

- Hardhat local network
- Sepolia testnet
- Goerli testnet (deprecated)

## Deployment

### Deployment Order

1. Deploy VoterRegistry
2. Deploy ElectionManager with VoterRegistry address
3. Grant roles to admin addresses
4. Verify contracts on Etherscan

### Post-Deployment

1. Transfer ownership to multi-sig
2. Set up monitoring
3. Document contract addresses
4. Update frontend configuration

## Security Considerations

### Known Risks

1. **Front-running**: Mitigated by commit-reveal
2. **Replay Attacks**: Prevented by nonce and chain ID
3. **Reentrancy**: Protected by ReentrancyGuard
4. **Access Control**: Role-based permissions
5. **Integer Overflow**: Solidity 0.8+ built-in protection

### Audit Recommendations

- External security audit before mainnet
- Bug bounty program
- Continuous monitoring
- Incident response plan

## Contract Addresses

### Mainnet
- VoterRegistry: TBD
- ElectionManager: TBD

### Sepolia Testnet
- VoterRegistry: TBD
- ElectionManager: TBD

### Local Development
- VoterRegistry: 0x5FbDB2315678afecb367f032d93F642f64180aa3
- ElectionManager: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

## ABI

Contract ABIs are available in:
- `contracts/artifacts/contracts/`
- `frontend/src/contracts/`

## Verification

Verify contracts on Etherscan:

```bash
npx hardhat verify --network sepolia VOTER_REGISTRY_ADDRESS
npx hardhat verify --network sepolia ELECTION_MANAGER_ADDRESS VOTER_REGISTRY_ADDRESS
```

## Future Enhancements

1. **Zero-Knowledge Proofs**: For ballot validity
2. **Multi-Signature Admin**: Decentralized governance
3. **Delegation**: Vote delegation support
4. **Quadratic Voting**: Alternative voting mechanisms
5. **Cross-Chain**: Multi-chain deployment
