# Quick Start Guide

Get the Decentralized Voting System up and running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- MetaMask ([Install](https://metamask.io/))

## Installation

### Option 1: Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Option 2: Manual Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd decentralized-voting-system
   npm run install:all
   ```

2. **Setup Environment Files**
   ```bash
   # Contracts
   cd contracts && cp env.example .env && cd ..
   
   # Backend
   cd backend && cp env.example .env && cd ..
   
   # Frontend
   cd frontend && cp env.example .env && cd ..
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Deploy Contracts**
   ```bash
   cd contracts
   npm run deploy:local
   ```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api-docs
- **Grafana Dashboard**: http://localhost:3001 (admin/admin)

## First Steps

### 1. Connect Your Wallet

1. Open http://localhost:3000
2. Click "Connect Wallet" in the top right
3. Select MetaMask
4. Approve the connection

### 2. Register as a Voter

1. Click "Register to Vote"
2. Fill in your details:
   - Email address
   - Identity proof (any test value)
3. Click "Register as Voter"
4. Confirm the transaction in MetaMask

### 3. Admin Setup (Optional)

1. Navigate to http://localhost:3000/admin/login
2. Default credentials:
   - Username: `admin`
   - Password: `admin123`
3. Create a new election from the dashboard

### 4. Create Your First Election (Admin)

1. Login to admin dashboard
2. Click "Create Election"
3. Fill in details:
   - Name: "Test Election"
   - Description: "My first election"
   - Start/End times
4. Add at least 2 candidates
5. Start the election

### 5. Cast a Vote

1. Navigate to "Elections"
2. Select your test election
3. Click "Vote Now"
4. Choose a candidate
5. Submit your vote
6. Save the transaction hash

### 6. Verify Your Vote

1. Go to "Verify Vote"
2. Enter your transaction hash
3. View confirmation details

## Common Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart a service
docker-compose restart backend

# Run tests
npm run test

# Deploy to testnet
cd contracts && npm run deploy:sepolia
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill the process or change port in docker-compose.yml
```

### MetaMask Connection Issues

1. Ensure you're on the correct network (Localhost 8545)
2. Reset MetaMask account: Settings → Advanced → Reset Account
3. Clear browser cache and reload

### Contract Deployment Fails

1. Ensure Hardhat node is running
2. Check you have test ETH in your wallet
3. Verify contract addresses in .env files

### Database Connection Error

```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

## Next Steps

- Read the [User Manual](./USER_MANUAL.md) for detailed usage
- Review [Architecture](./ARCHITECTURE.md) to understand the system
- Check [API Documentation](./API.md) for backend integration
- See [Deployment Guide](./DEPLOYMENT.md) for production setup

## Getting Help

- Check [Documentation](./README.md)
- Review [Troubleshooting](./USER_MANUAL.md#troubleshooting)
- Open an issue on GitHub
- Join our community chat

## Development Workflow

```bash
# Start development
docker-compose up

# Make changes to code (hot reload enabled)

# Run tests
npm run test

# Build for production
npm run build

# Deploy to testnet
npm run deploy:sepolia
```

## Project Structure

```
decentralized-voting-system/
├── contracts/          # Smart contracts (Solidity)
├── backend/           # API server (Node.js)
├── frontend/          # Web app (React)
├── infra/            # Infrastructure configs
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Key Features to Try

1. **Voter Registration**: Test the KYC flow
2. **Election Creation**: Create different types of elections
3. **Voting**: Cast votes and verify them
4. **Results**: View real-time tallying
5. **Audit Trail**: Check the audit logs
6. **Admin Dashboard**: Manage elections and voters

## Tips

- Use the API docs at `/api-docs` to test endpoints
- Check Grafana dashboards for system metrics
- Review audit logs for all system actions
- Test on Sepolia testnet before mainnet
- Always verify your votes using the transaction hash

## Clean Up

```bash
# Stop and remove all containers
docker-compose down -v

# Remove node_modules
npm run clean

# Start fresh
npm run install:all
docker-compose up -d
```

Happy voting! 🗳️
