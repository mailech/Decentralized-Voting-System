#!/bin/bash

# DVS Setup Script
# This script sets up the complete development environment

set -e

echo "🚀 Setting up Decentralized Voting System..."
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."

echo "  → Installing contract dependencies..."
cd contracts && npm install && cd ..

echo "  → Installing backend dependencies..."
cd backend && npm install && cd ..

echo "  → Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Dependencies installed"
echo ""

# Setup environment files
echo "⚙️  Setting up environment files..."

if [ ! -f "contracts/.env" ]; then
    cp contracts/env.example contracts/.env
    echo "  → Created contracts/.env"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "  → Created backend/.env"
fi

if [ ! -f "frontend/.env" ]; then
    echo "VITE_API_BASE_URL=http://localhost:4000/api" > frontend/.env
    echo "VITE_VOTER_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3" >> frontend/.env
    echo "VITE_ELECTION_MANAGER_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" >> frontend/.env
    echo "  → Created frontend/.env"
fi

echo "✅ Environment files created"
echo ""

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres

echo "  → Waiting for PostgreSQL to be ready..."
sleep 5

echo "✅ Docker services started"
echo ""

# Deploy contracts
echo "📝 Deploying smart contracts..."
cd contracts
npx hardhat node > /dev/null 2>&1 &
HARDHAT_PID=$!
sleep 3

npx hardhat run scripts/deploy.js --network localhost
cd ..

echo "✅ Smart contracts deployed"
echo ""

echo "✨ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Start all services: docker-compose up"
echo "  2. Access frontend: http://localhost:3000"
echo "  3. Access backend API: http://localhost:4000"
echo "  4. Access API docs: http://localhost:4000/api-docs"
echo ""
echo "📖 For more information, see README.md"
