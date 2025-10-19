# Testing Guide

## Overview

The DVS project includes comprehensive testing across all layers:
- Smart contract tests (Hardhat)
- Backend API tests (Jest)
- Frontend component tests (Vitest)
- End-to-end tests

## Smart Contract Testing

### Running Tests

```bash
cd contracts

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx hardhat test test/VoterRegistry.test.js

# Run with gas reporting
REPORT_GAS=true npm test
```

### Test Structure

```javascript
describe("ContractName", function () {
  async function deployFixture() {
    // Setup code
    return { contract, accounts };
  }

  describe("Function Group", function () {
    it("Should do something", async function () {
      const { contract } = await loadFixture(deployFixture);
      // Test code
      expect(await contract.someFunction()).to.equal(expectedValue);
    });
  });
});
```

### Coverage Goals

- Line coverage: >90%
- Branch coverage: >85%
- Function coverage: 100%

### Test Categories

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Contract interaction testing
3. **Security Tests**: Attack vector testing
4. **Gas Tests**: Gas optimization verification

## Backend Testing

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- voter.test.js
```

### Test Structure

```javascript
describe('Voter Controller', () => {
  beforeAll(async () => {
    // Setup database
  });

  afterAll(async () => {
    // Cleanup
  });

  describe('POST /api/voters/register', () => {
    it('should register a new voter', async () => {
      const response = await request(app)
        .post('/api/voters/register')
        .send({ walletAddress: '0x...', ... });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('voter');
    });
  });
});
```

### Test Database

- Use separate test database
- Reset between test suites
- Use transactions for isolation

### Mocking

```javascript
// Mock blockchain service
jest.mock('../services/blockchain.service');

// Mock external APIs
nock('https://api.example.com')
  .get('/endpoint')
  .reply(200, { data: 'mocked' });
```

## Frontend Testing

### Running Tests

```bash
cd frontend

# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific test
npm test -- HomePage.test.tsx
```

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders hero section', () => {
    render(<HomePage />);
    expect(screen.getByText(/Decentralized Voting System/i)).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<HomePage />);
    const button = screen.getByRole('button', { name: /register/i });
    await userEvent.click(button);
    // Assert navigation or state change
  });
});
```

### Testing Hooks

```typescript
import { renderHook } from '@testing-library/react';
import { useAuthStore } from './authStore';

describe('useAuthStore', () => {
  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.login('token', { id: '1', username: 'admin' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## End-to-End Testing

### Setup Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('complete voting flow', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:3000');
  
  // Connect wallet (mocked)
  await page.click('text=Connect Wallet');
  
  // Register as voter
  await page.goto('/register');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button:has-text("Register")');
  
  // Wait for confirmation
  await expect(page.locator('text=Registration successful')).toBeVisible();
  
  // Navigate to elections
  await page.goto('/elections');
  
  // Select election
  await page.click('.election-card:first-child');
  
  // Cast vote
  await page.click('text=Vote Now');
  await page.click('.candidate-card:first-child');
  await page.click('button:has-text("Submit Vote")');
  
  // Verify vote submitted
  await expect(page.locator('text=Vote submitted')).toBeVisible();
});
```

## Integration Testing

### Testing Contract + Backend

```javascript
describe('Voter Registration Flow', () => {
  it('should register voter on-chain and sync to database', async () => {
    // 1. Register via smart contract
    const tx = await voterRegistry.registerVoter(identityHash, ipfsCID);
    await tx.wait();
    
    // 2. Wait for event listener to sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Verify in database
    const voter = await db.Voter.findOne({ where: { walletAddress } });
    expect(voter).toBeDefined();
    expect(voter.isRegistered).toBe(true);
  });
});
```

## Performance Testing

### Load Testing with Artillery

```yaml
# artillery.yml
config:
  target: 'http://localhost:4000'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: 'Get Elections'
    flow:
      - get:
          url: '/api/elections'
```

Run:
```bash
artillery run artillery.yml
```

### Gas Profiling

```bash
cd contracts
REPORT_GAS=true npm test
```

## Security Testing

### Smart Contract Auditing

```bash
# Slither
slither contracts/

# MythX
mythx analyze contracts/VoterRegistry.sol
```

### Dependency Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### OWASP ZAP

```bash
# Run ZAP against API
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:4000/api
```

## Test Data

### Seed Data

```javascript
// backend/tests/seeds/voters.seed.js
module.exports = {
  voters: [
    {
      walletAddress: '0x1234...',
      identityHash: '0xabcd...',
      isVerified: true
    }
  ]
};
```

### Fixtures

```javascript
// contracts/test/fixtures.js
async function deployVoterRegistryFixture() {
  const [owner, verifier, voter1] = await ethers.getSigners();
  const VoterRegistry = await ethers.getContractFactory("VoterRegistry");
  const registry = await VoterRegistry.deploy();
  return { registry, owner, verifier, voter1 };
}
```

## Continuous Integration

Tests run automatically on:
- Every push to feature branches
- Pull requests to main/develop
- Scheduled nightly runs

### CI Configuration

See `.github/workflows/ci.yml`

## Test Coverage Reports

### Viewing Coverage

```bash
# Smart contracts
cd contracts && npm run test:coverage
open coverage/index.html

# Backend
cd backend && npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Badges

Add to README:
```markdown
![Coverage](https://img.shields.io/codecov/c/github/username/repo)
```

## Best Practices

1. **Write Tests First**: TDD approach
2. **Test Edge Cases**: Not just happy paths
3. **Mock External Dependencies**: Isolate units
4. **Use Descriptive Names**: Clear test descriptions
5. **Keep Tests Fast**: Optimize for speed
6. **Clean Up**: Reset state after tests
7. **Test User Flows**: E2E for critical paths
8. **Monitor Coverage**: Maintain high coverage
9. **Review Test Failures**: Don't ignore flaky tests
10. **Document Complex Tests**: Add comments

## Debugging Tests

### Smart Contracts

```javascript
// Add console.log in Solidity
import "hardhat/console.sol";
console.log("Value:", someValue);

// Debug with Hardhat
npx hardhat test --logs
```

### Backend

```javascript
// Use debugger
it('should do something', async () => {
  debugger; // Breakpoint
  const result = await someFunction();
});

// Run with inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Frontend

```typescript
// Use screen.debug()
it('renders component', () => {
  render(<Component />);
  screen.debug(); // Prints DOM
});
```

## Common Issues

### Issue: Tests timeout

**Solution**: Increase timeout
```javascript
it('slow test', async () => {
  // ...
}, 10000); // 10 second timeout
```

### Issue: Database conflicts

**Solution**: Use transactions
```javascript
beforeEach(async () => {
  await db.sequelize.transaction();
});

afterEach(async () => {
  await db.sequelize.rollback();
});
```

### Issue: Flaky tests

**Solution**: 
- Add proper waits
- Mock time-dependent code
- Ensure test isolation

## Resources

- [Hardhat Testing](https://hardhat.org/tutorial/testing-contracts)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
