const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("");

  // Deploy VoterRegistry
  console.log("📝 Deploying VoterRegistry...");
  const VoterRegistry = await hre.ethers.getContractFactory("VoterRegistry");
  const voterRegistry = await VoterRegistry.deploy();
  await voterRegistry.waitForDeployment();
  const voterRegistryAddress = await voterRegistry.getAddress();
  console.log("✅ VoterRegistry deployed to:", voterRegistryAddress);
  console.log("");

  // Deploy ElectionManager
  console.log("📝 Deploying ElectionManager...");
  const ElectionManager = await hre.ethers.getContractFactory("ElectionManager");
  const electionManager = await ElectionManager.deploy(voterRegistryAddress);
  await electionManager.waitForDeployment();
  const electionManagerAddress = await electionManager.getAddress();
  console.log("✅ ElectionManager deployed to:", electionManagerAddress);
  console.log("");

  // Save deployment addresses
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      VoterRegistry: voterRegistryAddress,
      ElectionManager: electionManagerAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${hre.network.name}-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  // Also save latest deployment
  const latestFile = path.join(deploymentsDir, `${hre.network.name}-latest.json`);
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("📄 Deployment info saved to:", deploymentFile);
  console.log("");

  // Save contract ABIs for frontend
  const artifactsDir = path.join(__dirname, "..", "artifacts", "contracts");
  const frontendAbiDir = path.join(__dirname, "..", "..", "frontend", "src", "contracts");
  
  if (!fs.existsSync(frontendAbiDir)) {
    fs.mkdirSync(frontendAbiDir, { recursive: true });
  }

  // Copy VoterRegistry ABI
  const voterRegistryArtifact = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "VoterRegistry.sol", "VoterRegistry.json"))
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, "VoterRegistry.json"),
    JSON.stringify({ abi: voterRegistryArtifact.abi, address: voterRegistryAddress }, null, 2)
  );

  // Copy ElectionManager ABI
  const electionManagerArtifact = JSON.parse(
    fs.readFileSync(path.join(artifactsDir, "ElectionManager.sol", "ElectionManager.json"))
  );
  fs.writeFileSync(
    path.join(frontendAbiDir, "ElectionManager.json"),
    JSON.stringify({ abi: electionManagerArtifact.abi, address: electionManagerAddress }, null, 2)
  );

  console.log("✅ Contract ABIs copied to frontend");
  console.log("");

  console.log("🎉 Deployment completed successfully!");
  console.log("");
  console.log("📋 Summary:");
  console.log("  Network:", hre.network.name);
  console.log("  VoterRegistry:", voterRegistryAddress);
  console.log("  ElectionManager:", electionManagerAddress);
  console.log("");

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("🔍 To verify contracts on Etherscan, run:");
    console.log(`  npx hardhat verify --network ${hre.network.name} ${voterRegistryAddress}`);
    console.log(`  npx hardhat verify --network ${hre.network.name} ${electionManagerAddress} ${voterRegistryAddress}`);
    console.log("");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
