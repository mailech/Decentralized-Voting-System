const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("VoterRegistry", function () {
  async function deployVoterRegistryFixture() {
    const [owner, verifier, voter1, voter2, voter3] = await ethers.getSigners();

    const VoterRegistry = await ethers.getContractFactory("VoterRegistry");
    const registry = await VoterRegistry.deploy();

    const VERIFIER_ROLE = await registry.VERIFIER_ROLE();
    await registry.grantRole(VERIFIER_ROLE, verifier.address);

    return { registry, owner, verifier, voter1, voter2, voter3, VERIFIER_ROLE };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { registry, owner } = await loadFixture(deployVoterRegistryFixture);
      const ADMIN_ROLE = await registry.ADMIN_ROLE();
      expect(await registry.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should initialize with zero registered voters", async function () {
      const { registry } = await loadFixture(deployVoterRegistryFixture);
      expect(await registry.totalRegistered()).to.equal(0);
      expect(await registry.totalVerified()).to.equal(0);
    });
  });

  describe("Voter Registration", function () {
    it("Should register a new voter", async function () {
      const { registry, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      const ipfsCID = "QmTest123";

      await expect(registry.connect(voter1).registerVoter(identityHash, ipfsCID))
        .to.emit(registry, "VoterRegistered")
        .withArgs(voter1.address, identityHash, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const voter = await registry.getVoter(voter1.address);
      expect(voter.isRegistered).to.be.true;
      expect(voter.isVerified).to.be.false;
      expect(voter.identityHash).to.equal(identityHash);
      expect(voter.ipfsCID).to.equal(ipfsCID);
    });

    it("Should not allow duplicate registration", async function () {
      const { registry, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest");

      await expect(
        registry.connect(voter1).registerVoter(identityHash, "QmTest2")
      ).to.be.revertedWith("Already registered");
    });

    it("Should not allow same identity hash twice", async function () {
      const { registry, voter1, voter2 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("same-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest1");

      await expect(
        registry.connect(voter2).registerVoter(identityHash, "QmTest2")
      ).to.be.revertedWith("Identity already used");
    });

    it("Should not allow zero identity hash", async function () {
      const { registry, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      await expect(
        registry.connect(voter1).registerVoter(ethers.ZeroHash, "QmTest")
      ).to.be.revertedWith("Invalid identity hash");
    });
  });

  describe("Voter Verification", function () {
    it("Should verify a registered voter", async function () {
      const { registry, verifier, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest");

      await expect(registry.connect(verifier).verifyVoter(voter1.address))
        .to.emit(registry, "VoterVerified")
        .withArgs(voter1.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const voter = await registry.getVoter(voter1.address);
      expect(voter.isVerified).to.be.true;
      expect(await registry.totalVerified()).to.equal(1);
    });

    it("Should not verify unregistered voter", async function () {
      const { registry, verifier, voter1 } = await loadFixture(deployVoterRegistryFixture);

      await expect(
        registry.connect(verifier).verifyVoter(voter1.address)
      ).to.be.revertedWith("Voter not registered");
    });

    it("Should not verify already verified voter", async function () {
      const { registry, verifier, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest");
      await registry.connect(verifier).verifyVoter(voter1.address);

      await expect(
        registry.connect(verifier).verifyVoter(voter1.address)
      ).to.be.revertedWith("Already verified");
    });

    it("Should batch verify multiple voters", async function () {
      const { registry, verifier, voter1, voter2, voter3 } = await loadFixture(deployVoterRegistryFixture);
      
      await registry.connect(voter1).registerVoter(ethers.keccak256(ethers.toUtf8Bytes("v1")), "QmTest1");
      await registry.connect(voter2).registerVoter(ethers.keccak256(ethers.toUtf8Bytes("v2")), "QmTest2");
      await registry.connect(voter3).registerVoter(ethers.keccak256(ethers.toUtf8Bytes("v3")), "QmTest3");

      await registry.connect(verifier).batchVerifyVoters([voter1.address, voter2.address, voter3.address]);

      expect(await registry.totalVerified()).to.equal(3);
      expect(await registry.isEligibleVoter(voter1.address)).to.be.true;
      expect(await registry.isEligibleVoter(voter2.address)).to.be.true;
      expect(await registry.isEligibleVoter(voter3.address)).to.be.true;
    });
  });

  describe("Voter Revocation", function () {
    it("Should revoke a voter", async function () {
      const { registry, owner, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest");

      await expect(registry.connect(owner).revokeVoter(voter1.address))
        .to.emit(registry, "VoterRevoked")
        .withArgs(voter1.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const voter = await registry.getVoter(voter1.address);
      expect(voter.isRegistered).to.be.false;
      expect(await registry.totalRegistered()).to.equal(0);
    });

    it("Should not revoke unregistered voter", async function () {
      const { registry, owner, voter1 } = await loadFixture(deployVoterRegistryFixture);

      await expect(
        registry.connect(owner).revokeVoter(voter1.address)
      ).to.be.revertedWith("Voter not registered");
    });
  });

  describe("Eligibility Check", function () {
    it("Should return true for eligible voter", async function () {
      const { registry, verifier, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest");
      await registry.connect(verifier).verifyVoter(voter1.address);

      expect(await registry.isEligibleVoter(voter1.address)).to.be.true;
    });

    it("Should return false for unverified voter", async function () {
      const { registry, voter1 } = await loadFixture(deployVoterRegistryFixture);
      
      const identityHash = ethers.keccak256(ethers.toUtf8Bytes("voter1-identity"));
      await registry.connect(voter1).registerVoter(identityHash, "QmTest");

      expect(await registry.isEligibleVoter(voter1.address)).to.be.false;
    });

    it("Should return false for unregistered voter", async function () {
      const { registry, voter1 } = await loadFixture(deployVoterRegistryFixture);

      expect(await registry.isEligibleVoter(voter1.address)).to.be.false;
    });
  });
});
