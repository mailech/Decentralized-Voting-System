# Deployment Guide

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MetaMask or Web3 wallet
- Git

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd decentralized-voting-system
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install individually
cd contracts && npm install
cd ../backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

**Contracts (.env)**
```bash
cd contracts
cp env.example .env
# Edit .env with your values
```

**Backend (.env)**
```bash
cd backend
cp env.example .env
# Edit .env with your values
```

**Frontend (.env)**
```bash
cd frontend
cp .env.example .env
# Edit .env with your values
```

### 4. Start Services with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Deploy Smart Contracts

```bash
cd contracts

# Start local Hardhat node (if not using Docker)
npx hardhat node

# Deploy contracts (in another terminal)
npm run deploy:local

# Note the deployed contract addresses
```

### 6. Update Contract Addresses

Update the following files with deployed addresses:
- `backend/.env` - VOTER_REGISTRY_ADDRESS, ELECTION_MANAGER_ADDRESS
- `frontend/.env` - VITE_VOTER_REGISTRY_ADDRESS, VITE_ELECTION_MANAGER_ADDRESS

### 7. Initialize Database

```bash
cd backend
npm run migrate
npm run seed  # Optional: seed with test data
```

### 8. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api-docs
- Grafana: http://localhost:3001 (admin/admin)
- Prometheus: http://localhost:9090

## Testnet Deployment (Sepolia)

### 1. Get Testnet ETH

- Visit https://sepoliafaucet.com
- Request test ETH for your deployer wallet

### 2. Configure Environment

```bash
# contracts/.env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 3. Deploy to Sepolia

```bash
cd contracts
npm run deploy:sepolia
```

### 4. Verify Contracts

```bash
npx hardhat verify --network sepolia VOTER_REGISTRY_ADDRESS
npx hardhat verify --network sepolia ELECTION_MANAGER_ADDRESS VOTER_REGISTRY_ADDRESS
```

### 5. Deploy Backend

**Option A: Docker**
```bash
docker build -t dvs-backend ./backend
docker run -p 4000:4000 --env-file ./backend/.env dvs-backend
```

**Option B: Cloud Platform (AWS/Heroku/Railway)**
- Push code to repository
- Configure environment variables
- Deploy using platform CLI or web interface

### 6. Deploy Frontend

**Option A: Vercel**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

**Option B: Netlify**
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

**Option C: AWS S3 + CloudFront**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Production Deployment

### Infrastructure Requirements

1. **Blockchain**
   - Ethereum Mainnet or Layer 2 (Polygon, Arbitrum)
   - Sufficient ETH for gas fees
   - Infura/Alchemy RPC endpoint

2. **Database**
   - PostgreSQL 15+ (AWS RDS, DigitalOcean, etc.)
   - Automated backups
   - Read replicas for scaling

3. **Backend**
   - Kubernetes cluster or Docker Swarm
   - Load balancer
   - Auto-scaling enabled
   - Health checks configured

4. **Frontend**
   - CDN (CloudFront, Cloudflare)
   - HTTPS enabled
   - Caching configured

5. **Monitoring**
   - Prometheus + Grafana
   - Log aggregation (ELK stack)
   - Error tracking (Sentry)

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/postgres.yaml
kubectl apply -f infra/k8s/backend.yaml
kubectl apply -f infra/k8s/frontend.yaml
kubectl apply -f infra/k8s/ingress.yaml

# Check status
kubectl get pods -n dvs
kubectl get services -n dvs
```

### Environment Variables (Production)

**Backend**
```
NODE_ENV=production
PORT=4000
DB_HOST=your-rds-endpoint.amazonaws.com
DB_NAME=dvs_prod
DB_USER=dvs_user
DB_PASSWORD=strong_password_here
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
VOTER_REGISTRY_ADDRESS=0x...
ELECTION_MANAGER_ADDRESS=0x...
JWT_SECRET=very_strong_secret_key
ENABLE_BLOCKCHAIN_LISTENER=true
```

**Frontend**
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_VOTER_REGISTRY_ADDRESS=0x...
VITE_ELECTION_MANAGER_ADDRESS=0x...
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_ENABLE_MAINNET=true
```

## Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enabled with valid SSL certificate
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Database backups automated
- [ ] Smart contracts audited
- [ ] API authentication enforced
- [ ] Input validation on all endpoints
- [ ] Logging and monitoring active
- [ ] Incident response plan documented

## Monitoring Setup

### Prometheus Targets

```yaml
- job_name: 'backend'
  static_configs:
    - targets: ['backend:4000']
  
- job_name: 'postgres'
  static_configs:
    - targets: ['postgres-exporter:9187']
```

### Grafana Dashboards

Import pre-built dashboards:
- Node.js Application Metrics
- PostgreSQL Database
- Nginx/Load Balancer
- Blockchain Node Status

## Backup Strategy

### Database Backups

```bash
# Daily automated backup
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h $DB_HOST -U $DB_USER $DB_NAME < backup_20240101.sql
```

### Smart Contract State

- Monitor contract events
- Store event logs in separate database
- Regular snapshots of contract state

## Rollback Procedure

1. Identify issue and stop deployment
2. Revert to previous Docker image/commit
3. Restore database from backup if needed
4. Verify system functionality
5. Document incident and root cause

## Scaling Considerations

### Horizontal Scaling

- Multiple backend instances behind load balancer
- Database read replicas
- Redis for session management

### Vertical Scaling

- Increase container resources
- Optimize database queries
- Enable caching layers

## Troubleshooting

### Common Issues

**Contract deployment fails**
- Check gas price and limit
- Verify RPC endpoint is accessible
- Ensure deployer has sufficient ETH

**Backend can't connect to database**
- Verify database credentials
- Check network connectivity
- Ensure database is running

**Frontend can't connect to backend**
- Check CORS configuration
- Verify API URL in environment
- Check network/firewall rules

**Blockchain listener not syncing**
- Verify RPC endpoint
- Check contract addresses
- Review event listener logs

## Support

For deployment issues:
- Check logs: `docker-compose logs`
- Review documentation
- Open GitHub issue
- Contact support team
