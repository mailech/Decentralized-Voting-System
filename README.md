# Decentralized Voting System (DVS)

A secure, transparent, and verifiable blockchain-based voting platform built with Solidity, Node.js, React, and PostgreSQL.

## 🎯 Features

- **Voter Registration**: Secure wallet-based or ID-verified registration
- **Anonymous Voting**: Encrypted vote commitments on-chain
- **Tamper-Proof**: Immutable blockchain storage
- **Transparent Tallying**: Verifiable results with audit trails
- **Admin Dashboard**: Complete election management interface
- **Public Verifiability**: Anyone can verify election integrity

## 🏗️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend    │────▶│  PostgreSQL │
│   (React)   │     │  (Node.js)   │     │             │
└──────┬──────┘     └──────┬───────┘     └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────────────────────────────┐
│      Ethereum Smart Contracts       │
│  (VoterRegistry, ElectionManager)   │
└─────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    IPFS     │
│  (Metadata) │
└─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Docker & Docker Compose
- MetaMask or compatible Web3 wallet

### Local Development

```bash
# Clone repository
git clone <repo-url>
cd decentralized-voting-system

# Start all services
docker-compose up -d

# Install dependencies
npm run install:all

# Deploy contracts to local network
cd contracts
npm run deploy:local

# Start development servers
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api-docs

## 📦 Project Structure

```
/
├── contracts/          # Solidity smart contracts
│   ├── contracts/
│   ├── test/
│   ├── scripts/
│   └── hardhat.config.js
├── backend/            # Node.js Express API
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/           # React TypeScript app
│   ├── src/
│   ├── public/
│   └── package.json
├── infra/              # Infrastructure configs
│   ├── docker/
│   ├── terraform/
│   └── k8s/
├── scripts/            # Utility scripts
├── .github/workflows/  # CI/CD pipelines
└── docker-compose.yml
```

## 🔐 Security Features

- **Access Control**: OpenZeppelin role-based permissions
- **Encrypted Votes**: Commit-reveal scheme
- **Replay Protection**: Nonce-based transaction validation
- **Audit Trail**: Complete event logging
- **Contract Auditing**: Slither and MythX integration

## 🧪 Testing

```bash
# Smart contract tests
cd contracts
npm test

# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Smart Contract Specs](./docs/CONTRACTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [User Manual](./docs/USER_MANUAL.md)

## 🌐 Deployment

### Testnet Deployment

```bash
# Deploy to Sepolia
cd contracts
npm run deploy:sepolia

# Deploy backend
cd backend
npm run deploy:staging
```

### Production Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 🛠️ Technology Stack

- **Smart Contracts**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Backend**: Node.js, Express, PostgreSQL, Prisma
- **Frontend**: React 18, TypeScript, Tailwind CSS, Ethers.js
- **Storage**: IPFS (web3.storage)
- **DevOps**: Docker, GitHub Actions, Terraform
- **Monitoring**: Prometheus, Grafana

## 📊 Monitoring

Access monitoring dashboards:
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🔗 Links

- [Demo Video](./docs/demo.mp4)
- [Live Testnet Demo](https://dvs-demo.example.com)
- [Contract Addresses](./docs/ADDRESSES.md)
