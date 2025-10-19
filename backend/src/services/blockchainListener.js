const { ethers } = require('ethers');
const db = require('../models');
const logger = require('../utils/logger');

class BlockchainListener {
  constructor() {
    this.provider = null;
    this.voterRegistry = null;
    this.electionManager = null;
    this.isListening = false;
  }

  async start() {
    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      const voterRegistryABI = require('../contracts/VoterRegistry.json').abi;
      const electionManagerABI = require('../contracts/ElectionManager.json').abi;

      this.voterRegistry = new ethers.Contract(
        process.env.VOTER_REGISTRY_ADDRESS,
        voterRegistryABI,
        this.provider
      );

      this.electionManager = new ethers.Contract(
        process.env.ELECTION_MANAGER_ADDRESS,
        electionManagerABI,
        this.provider
      );

      this.setupListeners();
      this.isListening = true;
      logger.info('Blockchain event listeners started');
    } catch (error) {
      logger.error('Failed to start blockchain listeners:', error);
    }
  }

  setupListeners() {
    // Voter Registry Events
    this.voterRegistry.on('VoterRegistered', async (voter, identityHash, timestamp, event) => {
      try {
        logger.info(`Event: VoterRegistered - ${voter}`);
        await this.handleVoterRegistered(voter, identityHash, timestamp, event);
      } catch (error) {
        logger.error('Error handling VoterRegistered event:', error);
      }
    });

    this.voterRegistry.on('VoterVerified', async (voter, timestamp, event) => {
      try {
        logger.info(`Event: VoterVerified - ${voter}`);
        await this.handleVoterVerified(voter, timestamp, event);
      } catch (error) {
        logger.error('Error handling VoterVerified event:', error);
      }
    });

    // Election Manager Events
    this.electionManager.on('ElectionCreated', async (electionId, name, startTime, endTime, event) => {
      try {
        logger.info(`Event: ElectionCreated - ${electionId}`);
        await this.handleElectionCreated(electionId, name, startTime, endTime, event);
      } catch (error) {
        logger.error('Error handling ElectionCreated event:', error);
      }
    });

    this.electionManager.on('VoteSubmitted', async (electionId, voter, voteCommitment, timestamp, event) => {
      try {
        logger.info(`Event: VoteSubmitted - Election ${electionId}, Voter ${voter}`);
        await this.handleVoteSubmitted(electionId, voter, voteCommitment, timestamp, event);
      } catch (error) {
        logger.error('Error handling VoteSubmitted event:', error);
      }
    });

    this.electionManager.on('ElectionClosed', async (electionId, timestamp, event) => {
      try {
        logger.info(`Event: ElectionClosed - ${electionId}`);
        await this.handleElectionClosed(electionId, timestamp, event);
      } catch (error) {
        logger.error('Error handling ElectionClosed event:', error);
      }
    });
  }

  async handleVoterRegistered(voter, identityHash, timestamp, event) {
    const txHash = event.log.transactionHash;
    const blockNumber = event.log.blockNumber;

    await db.Voter.update(
      { registrationTxHash: txHash, isRegistered: true },
      { where: { walletAddress: voter.toLowerCase() } }
    );

    await db.AuditLog.create({
      action: 'voter_registered_onchain',
      entityType: 'voter',
      details: { voter, identityHash, blockNumber },
      txHash,
    });
  }

  async handleVoterVerified(voter, timestamp, event) {
    const txHash = event.log.transactionHash;

    await db.Voter.update(
      { verificationTxHash: txHash, isVerified: true, verifiedAt: new Date() },
      { where: { walletAddress: voter.toLowerCase() } }
    );

    await db.AuditLog.create({
      action: 'voter_verified_onchain',
      entityType: 'voter',
      details: { voter },
      txHash,
    });
  }

  async handleElectionCreated(electionId, name, startTime, endTime, event) {
    const txHash = event.log.transactionHash;

    await db.Election.update(
      { creationTxHash: txHash },
      { where: { electionId: parseInt(electionId) } }
    );

    await db.AuditLog.create({
      action: 'election_created_onchain',
      entityType: 'election',
      details: { electionId: parseInt(electionId), name },
      txHash,
    });
  }

  async handleVoteSubmitted(electionId, voter, voteCommitment, timestamp, event) {
    const txHash = event.log.transactionHash;
    const blockNumber = event.log.blockNumber;

    const voterRecord = await db.Voter.findOne({ where: { walletAddress: voter.toLowerCase() } });
    const election = await db.Election.findOne({ where: { electionId: parseInt(electionId) } });

    if (voterRecord && election) {
      await db.Vote.update(
        { blockNumber, verified: true },
        { where: { txHash } }
      );

      await db.AuditLog.create({
        action: 'vote_confirmed_onchain',
        entityType: 'vote',
        userId: voterRecord.id,
        electionId: election.id,
        details: { electionId: parseInt(electionId), voter, blockNumber },
        txHash,
      });
    }
  }

  async handleElectionClosed(electionId, timestamp, event) {
    const txHash = event.log.transactionHash;

    const election = await db.Election.findOne({ where: { electionId: parseInt(electionId) } });
    if (election) {
      election.status = 'closed';
      election.closeTxHash = txHash;
      await election.save();

      await db.AuditLog.create({
        action: 'election_closed_onchain',
        entityType: 'election',
        electionId: election.id,
        details: { electionId: parseInt(electionId) },
        txHash,
      });
    }
  }

  stop() {
    if (this.voterRegistry) {
      this.voterRegistry.removeAllListeners();
    }
    if (this.electionManager) {
      this.electionManager.removeAllListeners();
    }
    this.isListening = false;
    logger.info('Blockchain event listeners stopped');
  }
}

const blockchainListener = new BlockchainListener();

module.exports = blockchainListener;
