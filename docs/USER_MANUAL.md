# User Manual - Decentralized Voting System

## Table of Contents

1. [Getting Started](#getting-started)
2. [Voter Guide](#voter-guide)
3. [Admin Guide](#admin-guide)
4. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- **Web3 Wallet**: Install MetaMask or another Web3-compatible wallet
- **Test ETH**: For testnet, get free ETH from a faucet
- **Modern Browser**: Chrome, Firefox, or Brave recommended

### First-Time Setup

1. **Install MetaMask**
   - Visit https://metamask.io
   - Download and install the browser extension
   - Create a new wallet or import existing one
   - **Important**: Save your seed phrase securely

2. **Connect to Network**
   - Open MetaMask
   - Select network (Sepolia for testnet, Ethereum for mainnet)
   - Ensure you have some ETH for gas fees

3. **Access DVS Platform**
   - Navigate to the DVS website
   - Click "Connect Wallet" in the top right
   - Approve the connection in MetaMask

## Voter Guide

### Step 1: Register as a Voter

1. Click "Register to Vote" on the homepage
2. Connect your wallet if not already connected
3. Fill in the registration form:
   - Email address (required)
   - Phone number (optional)
   - Identity proof (government ID number)
4. Click "Register as Voter"
5. Confirm the transaction in MetaMask
6. Wait for verification from admin

**Note**: Your identity information is hashed and encrypted. It's never stored in plaintext on the blockchain.

### Step 2: Check Verification Status

1. Navigate to your profile
2. Check "Verification Status"
3. If pending, wait for admin approval
4. Once verified, you can participate in elections

### Step 3: Browse Elections

1. Click "Elections" in the navigation menu
2. View all active and upcoming elections
3. Each election card shows:
   - Election name and description
   - Start and end dates
   - Number of candidates
   - Current vote count
   - Status (Created, Active, Closed, Tallied)

### Step 4: View Election Details

1. Click on an election card
2. Review election information:
   - Full description
   - Timeline
   - List of candidates with their details
   - Current results (if published)

### Step 5: Cast Your Vote

1. From the election details page, click "Vote Now"
2. Review all candidates carefully
3. Select your preferred candidate
4. Click "Submit Vote"
5. Review the vote commitment (encrypted)
6. Confirm the transaction in MetaMask
7. Wait for transaction confirmation
8. Save your transaction hash for verification

**Important**: 
- You can only vote once per election
- Votes cannot be changed after submission
- Your vote is encrypted and anonymous

### Step 6: Verify Your Vote

1. Click "Verify Vote" in the navigation
2. Enter your transaction hash
3. View verification details:
   - Transaction confirmed
   - Block number
   - Timestamp
   - Election name
   - Vote commitment hash

### Step 7: View Results

1. After election closes, navigate to "Results"
2. View real-time tallying (if enabled)
3. See final results with:
   - Vote counts per candidate
   - Percentages
   - Total votes cast
   - Charts and visualizations

## Admin Guide

### Admin Login

1. Navigate to "Admin" in the menu
2. Enter admin credentials
3. Click "Login"
4. Access admin dashboard

### Creating an Election

1. From admin dashboard, click "Create Election"
2. Fill in election details:
   - **Name**: Election title
   - **Description**: Detailed information
   - **Start Time**: When voting begins
   - **End Time**: When voting ends
   - **Privacy Mode**: 
     - Commit Only (default)
     - Commit-Reveal
     - Homomorphic
3. Click "Create Election"
4. Confirm transaction in MetaMask
5. Note the election ID

### Adding Candidates

1. Select an election from dashboard
2. Click "Add Candidate"
3. Enter candidate information:
   - Name
   - Description
   - Upload photo (optional)
   - Additional metadata
4. Click "Add Candidate"
5. Confirm transaction
6. Repeat for all candidates

**Note**: Candidates can only be added before election starts.

### Managing Voters

1. Navigate to "Voters" tab
2. View all registered voters
3. Filter by verification status
4. To verify a voter:
   - Click on voter record
   - Review identity information
   - Click "Verify Voter"
   - Confirm transaction

### Starting an Election

1. Ensure election has at least 2 candidates
2. Ensure current time is past start time
3. Click "Start Election"
4. Confirm transaction
5. Election status changes to "Active"

### Closing an Election

1. Wait until end time has passed
2. Click "Close Election"
3. Confirm transaction
4. Election status changes to "Closed"

### Tallying Results

1. After closing election, click "Tally Results"
2. For commit-reveal mode:
   - Wait for voters to reveal their votes
   - System automatically counts revealed votes
3. For commit-only mode:
   - Results are tallied off-chain
   - Published to blockchain
4. Confirm transaction
5. Results become publicly visible

### Viewing Audit Logs

1. Navigate to "Audit" tab
2. View all system actions:
   - Voter registrations
   - Verifications
   - Vote submissions
   - Election lifecycle events
3. Filter by:
   - Action type
   - Entity type
   - Date range
   - User
4. Export logs for compliance

## Troubleshooting

### Wallet Connection Issues

**Problem**: Can't connect wallet
- **Solution**: 
  - Ensure MetaMask is installed and unlocked
  - Refresh the page
  - Try a different browser
  - Clear browser cache

**Problem**: Wrong network
- **Solution**:
  - Open MetaMask
  - Click network dropdown
  - Select correct network (Sepolia/Mainnet)

### Registration Issues

**Problem**: Registration fails
- **Solution**:
  - Ensure you have enough ETH for gas
  - Check if wallet is already registered
  - Verify all required fields are filled
  - Try increasing gas limit

**Problem**: Verification pending too long
- **Solution**:
  - Contact admin team
  - Check audit logs for your registration
  - Verify identity information was correct

### Voting Issues

**Problem**: Can't submit vote
- **Solution**:
  - Ensure you're verified
  - Check if election is active
  - Verify you haven't already voted
  - Ensure sufficient gas

**Problem**: Transaction stuck
- **Solution**:
  - Check transaction on block explorer
  - Wait for confirmation (may take several minutes)
  - If stuck, try speeding up in MetaMask
  - Contact support if issue persists

### Verification Issues

**Problem**: Can't verify vote
- **Solution**:
  - Ensure transaction was confirmed
  - Wait a few minutes for indexing
  - Check transaction hash is correct
  - Try again later

### Admin Issues

**Problem**: Can't create election
- **Solution**:
  - Verify admin role permissions
  - Check start/end times are valid
  - Ensure sufficient gas
  - Review error message

**Problem**: Can't add candidates
- **Solution**:
  - Ensure election status is "Created"
  - Verify all required fields
  - Check gas limits

## Best Practices

### For Voters

1. **Save Your Transaction Hash**: Always save your vote transaction hash for verification
2. **Vote Early**: Don't wait until the last minute
3. **Verify Your Vote**: Use the verification tool to confirm your vote was counted
4. **Keep Wallet Secure**: Never share your private key or seed phrase
5. **Check Gas Prices**: Vote when gas prices are lower to save fees

### For Admins

1. **Test First**: Test elections on testnet before mainnet
2. **Verify Voters Promptly**: Don't delay voter verifications
3. **Set Realistic Timelines**: Allow sufficient time for voting
4. **Monitor Closely**: Watch for issues during active elections
5. **Backup Data**: Regularly export audit logs
6. **Communicate Clearly**: Keep voters informed of election status

## Security Tips

1. **Never Share Private Keys**: Your private key controls your wallet
2. **Verify URLs**: Always check you're on the correct website
3. **Use Hardware Wallets**: For large amounts or admin accounts
4. **Enable 2FA**: If available for admin accounts
5. **Keep Software Updated**: Update MetaMask and browsers regularly
6. **Be Wary of Phishing**: Don't click suspicious links
7. **Review Transactions**: Always review before confirming in MetaMask

## Support

### Getting Help

- **Documentation**: Review all docs in `/docs` folder
- **FAQ**: Check frequently asked questions
- **GitHub Issues**: Report bugs or request features
- **Email Support**: support@dvs.example.com
- **Community**: Join our Discord/Telegram

### Reporting Issues

When reporting issues, include:
- Description of the problem
- Steps to reproduce
- Screenshots if applicable
- Transaction hash (if relevant)
- Browser and wallet version
- Network being used

## Glossary

- **Wallet**: Software that stores your private keys
- **Gas**: Fee paid for blockchain transactions
- **Transaction Hash**: Unique identifier for a blockchain transaction
- **Smart Contract**: Self-executing code on the blockchain
- **Commit-Reveal**: Two-phase voting for enhanced privacy
- **IPFS**: Decentralized file storage system
- **Verification**: Admin approval of voter identity
- **Tally**: Counting of votes after election closes
