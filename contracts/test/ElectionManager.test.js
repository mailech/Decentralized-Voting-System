const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ElectionManager", function () {
  async function deployElectionManagerFixture() {
    const [owner, manager, voter1, voter2, voter3] = await ethers.getSigners();

    // Deploy VoterRegistry
    const VoterRegistry = await ethers.getContractFactory("VoterRegistry");
    const registry = await VoterRegistry.deploy();

    // Deploy ElectionManager
    const ElectionManager = await ethers.getContractFactory("ElectionManager");
    const electionManager = await ElectionManager.deploy(await registry.getAddress());

    // Grant roles
    const VERIFIER_ROLE = await registry.VERIFIER_ROLE();
    await registry.grantRole(VERIFIER_ROLE, owner.address);

    const ELECTION_MANAGER_ROLE = await electionManager.ELECTION_MANAGER_ROLE();
    await electionManager.grantRole(ELECTION_MANAGER_ROLE, manager.address);

    // Register and verify voters
    const identityHash1 = ethers.keccak256(ethers.toUtf8Bytes("voter1"));
    const identityHash2 = ethers.keccak256(ethers.toUtf8Bytes("voter2"));
    const identityHash3 = ethers.keccak256(ethers.toUtf8Bytes("voter3"));

    await registry.connect(voter1).registerVoter(identityHash1, "QmVoter1");
    await registry.connect(voter2).registerVoter(identityHash2, "QmVoter2");
    await registry.connect(voter3).registerVoter(identityHash3, "QmVoter3");

    await registry.verifyVoter(voter1.address);
    await registry.verifyVoter(voter2.address);
    await registry.verifyVoter(voter3.address);

    return { electionManager, registry, owner, manager, voter1, voter2, voter3 };
  }

  describe("Deployment", function () {
    it("Should set the voter registry correctly", async function () {
      const { electionManager, registry } = await loadFixture(deployElectionManagerFixture);
      expect(await electionManager.voterRegistry()).to.equal(await registry.getAddress());
    });

    it("Should initialize with zero elections", async function () {
      const { electionManager } = await loadFixture(deployElectionManagerFixture);
      expect(await electionManager.electionCount()).to.equal(0);
    });
  });

  describe("Election Creation", function () {
    it("Should create a new election", async function () {
      const { electionManager, manager } = await loadFixture(deployElectionManagerFixture);
      
      const startTime = (await time.latest()) + 3600; // 1 hour from now
      const endTime = startTime + 86400; // 24 hours duration

      await expect(
        electionManager.connect(manager).createElection(
          "Presidential Election",
          "2024 Presidential Election",
          startTime,
          endTime,
          0, // CommitOnly mode
          "QmElection123"
        )
      ).to.emit(electionManager, "ElectionCreated");

      const election = await electionManager.getElection(0);
      expect(election.name).to.equal("Presidential Election");
      expect(election.status).to.equal(0); // Created
    });

    it("Should not create election with past start time", async function () {
      const { electionManager, manager } = await loadFixture(deployElectionManagerFixture);
      
      const startTime = (await time.latest()) - 3600;
      const endTime = startTime + 86400;

      await expect(
        electionManager.connect(manager).createElection(
          "Test Election",
          "Description",
          startTime,
          endTime,
          0,
          "QmTest"
        )
      ).to.be.revertedWith("Start time must be in future");
    });

    it("Should not create election with end time before start time", async function () {
      const { electionManager, manager } = await loadFixture(deployElectionManagerFixture);
      
      const startTime = (await time.latest()) + 3600;
      const endTime = startTime - 1800;

      await expect(
        electionManager.connect(manager).createElection(
          "Test Election",
          "Description",
          startTime,
          endTime,
          0,
          "QmTest"
        )
      ).to.be.revertedWith("End time must be after start time");
    });
  });

  describe("Candidate Management", function () {
    async function createElectionFixture() {
      const fixture = await loadFixture(deployElectionManagerFixture);
      const { electionManager, manager } = fixture;
      
      const startTime = (await time.latest()) + 3600;
      const endTime = startTime + 86400;

      await electionManager.connect(manager).createElection(
        "Test Election",
        "Description",
        startTime,
        endTime,
        0,
        "QmElection"
      );

      return { ...fixture, startTime, endTime };
    }

    it("Should add candidates to election", async function () {
      const { electionManager, manager } = await loadFixture(createElectionFixture);

      await expect(
        electionManager.connect(manager).addCandidate(0, "Alice", "Candidate A", "QmAlice")
      ).to.emit(electionManager, "CandidateAdded").withArgs(0, 0, "Alice");

      await electionManager.connect(manager).addCandidate(0, "Bob", "Candidate B", "QmBob");

      const candidate = await electionManager.getCandidate(0, 0);
      expect(candidate.name).to.equal("Alice");
    });

    it("Should not add candidate to non-existent election", async function () {
      const { electionManager, manager } = await loadFixture(createElectionFixture);

      await expect(
        electionManager.connect(manager).addCandidate(999, "Alice", "Candidate A", "QmAlice")
      ).to.be.revertedWith("Invalid election");
    });
  });

  describe("Voting Process", function () {
    async function setupVotingFixture() {
      const fixture = await loadFixture(deployElectionManagerFixture);
      const { electionManager, manager } = fixture;
      
      const startTime = (await time.latest()) + 100;
      const endTime = startTime + 3600;

      await electionManager.connect(manager).createElection(
        "Test Election",
        "Description",
        startTime,
        endTime,
        0,
        "QmElection"
      );

      await electionManager.connect(manager).addCandidate(0, "Alice", "Candidate A", "QmAlice");
      await electionManager.connect(manager).addCandidate(0, "Bob", "Candidate B", "QmBob");

      // Fast forward to start time
      await time.increaseTo(startTime);
      await electionManager.connect(manager).startElection(0);

      return { ...fixture, startTime, endTime };
    }

    it("Should allow eligible voter to submit vote", async function () {
      const { electionManager, voter1 } = await loadFixture(setupVotingFixture);

      const candidateId = 0;
      const salt = ethers.keccak256(ethers.toUtf8Bytes("random-salt"));
      const voteCommitment = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256", "bytes32", "address"],
          [candidateId, salt, voter1.address]
        )
      );

      await expect(electionManager.connect(voter1).submitVote(0, voteCommitment))
        .to.emit(electionManager, "VoteSubmitted")
        .withArgs(0, voter1.address, voteCommitment, await time.latest() + 1);

      expect(await electionManager.hasVotedInElection(0, voter1.address)).to.be.true;
    });

    it("Should not allow double voting", async function () {
      const { electionManager, voter1 } = await loadFixture(setupVotingFixture);

      const voteCommitment = ethers.keccak256(ethers.toUtf8Bytes("vote1"));
      await electionManager.connect(voter1).submitVote(0, voteCommitment);

      await expect(
        electionManager.connect(voter1).submitVote(0, voteCommitment)
      ).to.be.revertedWith("Already voted");
    });

    it("Should not allow voting after election ends", async function () {
      const { electionManager, voter1, endTime } = await loadFixture(setupVotingFixture);

      await time.increaseTo(endTime + 1);

      const voteCommitment = ethers.keccak256(ethers.toUtf8Bytes("vote1"));
      await expect(
        electionManager.connect(voter1).submitVote(0, voteCommitment)
      ).to.be.revertedWith("Election ended");
    });

    it("Should track total votes", async function () {
      const { electionManager, voter1, voter2 } = await loadFixture(setupVotingFixture);

      const vote1 = ethers.keccak256(ethers.toUtf8Bytes("vote1"));
      const vote2 = ethers.keccak256(ethers.toUtf8Bytes("vote2"));

      await electionManager.connect(voter1).submitVote(0, vote1);
      await electionManager.connect(voter2).submitVote(0, vote2);

      const election = await electionManager.getElection(0);
      expect(election.totalVotes).to.equal(2);
    });
  });

  describe("Election Lifecycle", function () {
    async function fullElectionFixture() {
      const fixture = await loadFixture(deployElectionManagerFixture);
      const { electionManager, manager, voter1, voter2 } = fixture;
      
      const startTime = (await time.latest()) + 100;
      const endTime = startTime + 3600;

      await electionManager.connect(manager).createElection(
        "Test Election",
        "Description",
        startTime,
        endTime,
        0,
        "QmElection"
      );

      await electionManager.connect(manager).addCandidate(0, "Alice", "Candidate A", "QmAlice");
      await electionManager.connect(manager).addCandidate(0, "Bob", "Candidate B", "QmBob");

      await time.increaseTo(startTime);
      await electionManager.connect(manager).startElection(0);

      // Cast votes
      await electionManager.connect(voter1).submitVote(0, ethers.keccak256(ethers.toUtf8Bytes("vote1")));
      await electionManager.connect(voter2).submitVote(0, ethers.keccak256(ethers.toUtf8Bytes("vote2")));

      return { ...fixture, startTime, endTime };
    }

    it("Should close election after end time", async function () {
      const { electionManager, manager, endTime } = await loadFixture(fullElectionFixture);

      await time.increaseTo(endTime + 1);

      await expect(electionManager.connect(manager).closeElection(0))
        .to.emit(electionManager, "ElectionClosed");

      const election = await electionManager.getElection(0);
      expect(election.status).to.equal(2); // Closed
    });

    it("Should not close election before end time", async function () {
      const { electionManager, manager } = await loadFixture(fullElectionFixture);

      await expect(
        electionManager.connect(manager).closeElection(0)
      ).to.be.revertedWith("Election still ongoing");
    });

    it("Should tally election after closing", async function () {
      const { electionManager, manager, endTime } = await loadFixture(fullElectionFixture);

      await time.increaseTo(endTime + 1);
      await electionManager.connect(manager).closeElection(0);

      await expect(electionManager.connect(manager).tallyElection(0))
        .to.emit(electionManager, "ElectionTallied");

      const election = await electionManager.getElection(0);
      expect(election.status).to.equal(3); // Tallied
    });
  });

  describe("Vote Verification", function () {
    it("Should retrieve vote commitment", async function () {
      const { electionManager, voter1 } = await loadFixture(deployElectionManagerFixture);
      
      const { manager } = await loadFixture(deployElectionManagerFixture);
      const startTime = (await time.latest()) + 100;
      const endTime = startTime + 3600;

      await electionManager.connect(manager).createElection("Test", "Desc", startTime, endTime, 0, "Qm");
      await electionManager.connect(manager).addCandidate(0, "Alice", "A", "QmA");
      await electionManager.connect(manager).addCandidate(0, "Bob", "B", "QmB");

      await time.increaseTo(startTime);
      await electionManager.connect(manager).startElection(0);

      const voteCommitment = ethers.keccak256(ethers.toUtf8Bytes("vote1"));
      await electionManager.connect(voter1).submitVote(0, voteCommitment);

      const retrievedCommitment = await electionManager.getVoteCommitment(0, voter1.address);
      expect(retrievedCommitment).to.equal(voteCommitment);
    });
  });
});
