# Contributing to Decentralized Voting System

Thank you for your interest in contributing to DVS! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Detailed description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, wallet version)

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach
   - Any relevant examples or mockups

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the coding standards
   - Write tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
   Use conventional commit messages:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Test additions/changes
   - `chore:` Build process or auxiliary tool changes

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Ensure all tests pass
   - Request review from maintainers

## Development Setup

See [README.md](./README.md) for setup instructions.

## Coding Standards

### Smart Contracts (Solidity)

- Follow Solidity style guide
- Use NatSpec comments for all public functions
- Write comprehensive tests (>90% coverage)
- Use OpenZeppelin libraries where possible
- Run Slither for security analysis

### Backend (Node.js)

- Use ES6+ features
- Follow Airbnb JavaScript style guide
- Write JSDoc comments for functions
- Use async/await over callbacks
- Handle errors properly
- Write unit tests for all services

### Frontend (React/TypeScript)

- Use TypeScript for type safety
- Follow React best practices
- Use functional components and hooks
- Write meaningful component names
- Keep components small and focused
- Use Tailwind CSS for styling
- Write accessible HTML

## Testing

- Write tests for all new features
- Ensure existing tests pass
- Aim for high test coverage
- Test edge cases and error conditions

### Running Tests

```bash
# Smart contracts
cd contracts && npm test

# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Documentation

- Update README if adding new features
- Add JSDoc/TSDoc comments to code
- Update API documentation for new endpoints
- Include examples in documentation
- Keep documentation up to date

## Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

## Questions?

Feel free to ask questions by:
- Opening an issue
- Joining our community chat
- Emailing the maintainers

Thank you for contributing to DVS!
