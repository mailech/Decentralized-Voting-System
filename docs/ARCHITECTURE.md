# DVS Architecture

## System Overview

The Decentralized Voting System (DVS) is built on a multi-tier architecture combining blockchain technology with traditional web services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  React + TypeScript + Tailwind + Ethers.js + RainbowKit    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├──────────────┬──────────────┐
                     │              │              │
                     ▼              ▼              ▼
┌────────────────────────┐  ┌──────────────┐  ┌─────────────┐
│    Backend API         │  │  Blockchain  │  │    IPFS     │
│  Node.js + Express     │  │   Ethereum   │  │  Storage    │
│    PostgreSQL          │  │   Hardhat    │  │             │
└────────────────────────┘  └──────────────┘  └─────────────┘
```

## Components

### 1. Smart Contracts (Solidity)

**VoterRegistry.sol**
- Manages voter registration and verification
- Stores identity hashes (not plaintext)
- Role-based access control for verifiers
- Events: VoterRegistered, VoterVerified, VoterRevoked

**ElectionManager.sol**
- Creates and manages elections
- Handles candidate registration
- Processes vote commitments
- Manages election lifecycle (Created → Active → Closed → Tallied)
- Events: ElectionCreated, VoteSubmitted, ElectionClosed

### 2. Backend API (Node.js)

**Technology Stack:**
- Express.js for REST API
- Sequelize ORM with PostgreSQL
- JWT authentication for admins
- Ethers.js for blockchain interaction
- Winston for logging
- Swagger for API documentation

**Key Services:**
- **Blockchain Service**: Interacts with smart contracts
- **Blockchain Listener**: Syncs on-chain events to database
- **Audit Service**: Logs all system actions
- **IPFS Service**: Stores encrypted metadata

**Database Schema:**
- voters: Voter registration data
- elections: Election metadata
- candidates: Candidate information
- votes: Vote records with commitments
- audit_logs: Complete audit trail
- admins: Admin user accounts

### 3. Frontend (React)

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Wagmi + RainbowKit for Web3 integration
- React Router for navigation
- Zustand for state management
- React Hook Form + Zod for forms

**Key Pages:**
- Home: Landing page with features
- Elections: Browse active elections
- Voting: Cast encrypted votes
- Results: View election results
- Admin Dashboard: Manage elections
- Verify: Verify vote inclusion

### 4. Infrastructure

**Docker Compose:**
- PostgreSQL database
- Hardhat local blockchain
- Backend API server
- Frontend development server
- IPFS node
- Prometheus monitoring
- Grafana dashboards

**CI/CD:**
- GitHub Actions for automated testing
- Contract testing with Hardhat
- Backend unit tests
- Frontend linting and build
- Security audits
- Docker image builds

## Data Flow

### Voter Registration Flow

1. User connects wallet (MetaMask)
2. Frontend generates identity hash
3. Backend validates and stores in DB
4. Transaction sent to VoterRegistry contract
5. Admin verifies voter off-chain
6. Verification transaction sent on-chain
7. Voter becomes eligible to vote

### Voting Flow

1. Voter selects election and candidate
2. Frontend generates vote commitment: `keccak256(candidateId, salt, voterAddress)`
3. Vote commitment sent to ElectionManager contract
4. Transaction hash returned to voter
5. Backend listener syncs vote to database
6. Voter receives receipt with tx hash
7. Vote can be verified using tx hash

### Result Tallying Flow

1. Admin closes election on-chain
2. For commit-reveal: voters reveal their votes
3. Smart contract tallies votes
4. Results published on-chain
5. Backend syncs results to database
6. Frontend displays results with charts

## Security Measures

1. **Access Control**: Role-based permissions using OpenZeppelin
2. **Encryption**: Vote commitments hide actual votes
3. **Reentrancy Protection**: ReentrancyGuard on critical functions
4. **Input Validation**: Comprehensive validation on all layers
5. **Rate Limiting**: API rate limits to prevent abuse
6. **Audit Logging**: Complete audit trail of all actions
7. **HTTPS**: Encrypted communication (production)
8. **Environment Variables**: Secrets never hardcoded

## Scalability Considerations

1. **Database Indexing**: Optimized queries with proper indexes
2. **Caching**: Redis for frequently accessed data (optional)
3. **Load Balancing**: Multiple backend instances (production)
4. **IPFS**: Distributed storage for metadata
5. **Layer 2**: Consider Polygon/Arbitrum for lower gas fees

## Privacy Features

1. **Vote Commitments**: Actual votes hidden until reveal
2. **Zero-Knowledge Proofs**: Optional ZK-SNARKs for ballot validity
3. **Homomorphic Encryption**: Optional for tallying without decryption
4. **Identity Hashing**: Personal data never exposed on-chain

## Monitoring & Observability

1. **Prometheus**: Metrics collection
2. **Grafana**: Visualization dashboards
3. **Winston Logging**: Structured application logs
4. **Audit Logs**: Database-level audit trail
5. **Blockchain Events**: Real-time event monitoring

## Deployment Options

### Development
- Docker Compose for local environment
- Hardhat local blockchain
- Hot reload for all services

### Staging
- Sepolia testnet
- Cloud database (AWS RDS)
- Docker containers on EC2/ECS

### Production
- Ethereum mainnet or Polygon
- Kubernetes cluster
- Load balancers
- CDN for frontend
- Managed PostgreSQL
- Backup and disaster recovery
