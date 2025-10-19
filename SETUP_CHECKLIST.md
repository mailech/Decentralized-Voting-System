# Setup Checklist

Use this checklist to ensure your DVS installation is complete and working correctly.

## Prerequisites ✅

- [ ] Node.js 18+ installed
- [ ] Docker Desktop installed and running
- [ ] MetaMask browser extension installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Installation Steps ✅

### 1. Clone and Setup

- [ ] Repository cloned
- [ ] Navigate to project directory
- [ ] Run `npm run install:all` or automated setup script

### 2. Environment Configuration

**Contracts:**
- [ ] `contracts/.env` file created
- [ ] RPC URLs configured (if deploying to testnet)
- [ ] Private key added (for deployment)

**Backend:**
- [ ] `backend/.env` file created
- [ ] Database credentials set
- [ ] JWT secret configured
- [ ] Blockchain RPC URL set
- [ ] Contract addresses added (after deployment)

**Frontend:**
- [ ] `frontend/.env` file created
- [ ] API base URL configured
- [ ] Contract addresses added (after deployment)
- [ ] WalletConnect project ID added (optional)

### 3. Docker Services

- [ ] Docker Desktop is running
- [ ] Run `docker-compose up -d`
- [ ] PostgreSQL container running
- [ ] All containers healthy

### 4. Smart Contract Deployment

- [ ] Hardhat node running (or using testnet)
- [ ] Contracts compiled: `cd contracts && npm run compile`
- [ ] Contracts deployed: `npm run deploy:local`
- [ ] Contract addresses noted
- [ ] ABIs copied to frontend

### 5. Database Setup

- [ ] PostgreSQL accessible
- [ ] Database created
- [ ] Tables created (auto-sync or migrations)
- [ ] Test connection successful

## Verification Steps ✅

### Frontend

- [ ] Frontend accessible at http://localhost:3000
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] "Connect Wallet" button visible
- [ ] No console errors

### Backend

- [ ] Backend API accessible at http://localhost:4000
- [ ] Health check endpoint works: `GET /health`
- [ ] API docs accessible: http://localhost:4000/api-docs
- [ ] Database connection successful
- [ ] No startup errors in logs

### Smart Contracts

- [ ] Contracts deployed successfully
- [ ] Contract addresses available
- [ ] Can interact with contracts via frontend
- [ ] Events are being emitted

### Wallet Connection

- [ ] MetaMask connects to application
- [ ] Correct network selected (Localhost 8545 or Sepolia)
- [ ] Account has test ETH
- [ ] No connection errors

## Functional Testing ✅

### Voter Registration

- [ ] Can access registration page
- [ ] Form validation works
- [ ] Can submit registration
- [ ] Transaction confirms in MetaMask
- [ ] Registration recorded in database
- [ ] Event emitted on blockchain

### Admin Functions

- [ ] Can access admin login
- [ ] Can login with credentials
- [ ] Admin dashboard loads
- [ ] Can create election
- [ ] Can add candidates
- [ ] Can verify voters
- [ ] Can start/close elections

### Voting

- [ ] Can view elections list
- [ ] Can view election details
- [ ] Can access voting page
- [ ] Can select candidate
- [ ] Can submit vote
- [ ] Transaction confirms
- [ ] Vote recorded on-chain
- [ ] Vote synced to database

### Vote Verification

- [ ] Can access verification page
- [ ] Can enter transaction hash
- [ ] Verification details display
- [ ] Blockchain data matches

### Results

- [ ] Can view results page
- [ ] Results display correctly
- [ ] Vote counts accurate
- [ ] Charts/visualizations work

## Monitoring & Logs ✅

### Application Logs

- [ ] Backend logs accessible: `docker-compose logs backend`
- [ ] No error messages
- [ ] Request logging working
- [ ] Blockchain listener active

### Monitoring

- [ ] Prometheus accessible: http://localhost:9090
- [ ] Metrics being collected
- [ ] Grafana accessible: http://localhost:3001
- [ ] Dashboards configured

### Audit Logs

- [ ] Audit logs being created
- [ ] Can view logs via API
- [ ] All actions logged
- [ ] Timestamps correct

## Security Checks ✅

- [ ] No private keys in code
- [ ] Environment variables used for secrets
- [ ] `.env` files in `.gitignore`
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] SQL injection protection in place
- [ ] XSS protection enabled

## Performance Checks ✅

- [ ] Page load times acceptable (<3s)
- [ ] API response times fast (<500ms)
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Gas costs reasonable

## Documentation ✅

- [ ] README.md reviewed
- [ ] Architecture documentation read
- [ ] API documentation accessible
- [ ] User manual available
- [ ] Deployment guide reviewed

## Common Issues Resolution ✅

### Port Conflicts

- [ ] No other services on port 3000
- [ ] No other services on port 4000
- [ ] No other services on port 5432
- [ ] No other services on port 8545

### Database Issues

- [ ] PostgreSQL container running
- [ ] Correct credentials in .env
- [ ] Database created
- [ ] Can connect via psql or GUI tool

### Blockchain Issues

- [ ] Hardhat node running
- [ ] Correct network in MetaMask
- [ ] Sufficient test ETH
- [ ] Contract addresses correct

### Build Issues

- [ ] Node modules installed
- [ ] No dependency conflicts
- [ ] TypeScript compiles without errors
- [ ] No linting errors

## Testing ✅

### Smart Contracts

- [ ] Run `cd contracts && npm test`
- [ ] All tests pass
- [ ] Coverage >90%
- [ ] No security warnings

### Backend

- [ ] Run `cd backend && npm test`
- [ ] All tests pass
- [ ] API endpoints tested
- [ ] Database operations tested

### Frontend

- [ ] Run `cd frontend && npm run lint`
- [ ] No linting errors
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors

## Production Readiness (Optional) ✅

- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Incident response plan documented
- [ ] SSL certificates obtained
- [ ] Domain configured
- [ ] CDN setup (if needed)
- [ ] Mainnet deployment plan ready

## Final Verification ✅

### End-to-End Test

1. [ ] Register as voter
2. [ ] Get verified by admin
3. [ ] Admin creates election
4. [ ] Admin adds candidates
5. [ ] Admin starts election
6. [ ] Cast vote
7. [ ] Verify vote
8. [ ] Admin closes election
9. [ ] View results
10. [ ] Check audit logs

### System Health

- [ ] All services running
- [ ] No errors in logs
- [ ] Monitoring active
- [ ] Database healthy
- [ ] Blockchain synced

## Troubleshooting Resources ✅

If you encounter issues:

1. [ ] Check logs: `docker-compose logs -f`
2. [ ] Review [QUICKSTART.md](./docs/QUICKSTART.md)
3. [ ] Check [USER_MANUAL.md](./docs/USER_MANUAL.md) troubleshooting section
4. [ ] Search GitHub issues
5. [ ] Ask in community chat

## Success Criteria ✅

Your DVS installation is complete when:

- ✅ All services are running without errors
- ✅ You can register as a voter
- ✅ Admin can create and manage elections
- ✅ You can cast and verify votes
- ✅ Results display correctly
- ✅ Monitoring is active
- ✅ All tests pass

## Next Steps

Once setup is complete:

1. [ ] Explore the admin dashboard
2. [ ] Test different voting scenarios
3. [ ] Review the codebase
4. [ ] Customize for your use case
5. [ ] Deploy to testnet
6. [ ] Plan production deployment

---

**Setup Complete?** 🎉

Congratulations! Your Decentralized Voting System is ready to use.

For questions or issues, refer to the documentation or open a GitHub issue.
