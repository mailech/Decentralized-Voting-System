# DVS Setup Script for Windows (PowerShell)
# This script sets up the complete development environment

Write-Host "🚀 Setting up Decentralized Voting System..." -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

try {
    $dockerVersion = docker --version
    Write-Host "  ✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "  ✅ Docker Compose: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

Write-Host "  → Installing contract dependencies..."
Set-Location contracts
npm install
Set-Location ..

Write-Host "  → Installing backend dependencies..."
Set-Location backend
npm install
Set-Location ..

Write-Host "  → Installing frontend dependencies..."
Set-Location frontend
npm install
Set-Location ..

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Setup environment files
Write-Host "⚙️  Setting up environment files..." -ForegroundColor Yellow

if (-not (Test-Path "contracts\.env")) {
    Copy-Item "contracts\env.example" "contracts\.env"
    Write-Host "  → Created contracts\.env"
}

if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "  → Created backend\.env"
}

if (-not (Test-Path "frontend\.env")) {
    @"
VITE_API_BASE_URL=http://localhost:4000/api
VITE_VOTER_REGISTRY_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_ELECTION_MANAGER_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
"@ | Out-File -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "  → Created frontend\.env"
}

Write-Host "✅ Environment files created" -ForegroundColor Green
Write-Host ""

# Start Docker services
Write-Host "🐳 Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d postgres

Write-Host "  → Waiting for PostgreSQL to be ready..."
Start-Sleep -Seconds 5

Write-Host "✅ Docker services started" -ForegroundColor Green
Write-Host ""

Write-Host "✨ Setup complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Start all services: docker-compose up"
Write-Host "  2. Access frontend: http://localhost:3000"
Write-Host "  3. Access backend API: http://localhost:4000"
Write-Host "  4. Access API docs: http://localhost:4000/api-docs"
Write-Host ""
Write-Host "📖 For more information, see README.md"
