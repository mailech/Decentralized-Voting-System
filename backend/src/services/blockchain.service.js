const { ethers } = require('ethers');
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.voterRegistry = null;
    this.electionManager = null;
  }

  async initialize() {
    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      const privateKey = process.env.ADMIN_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('ADMIN_PRIVATE_KEY not set');
      }

      this.signer = new ethers.Wallet(privateKey, this.provider);

      // Load contract ABIs and addresses
      const voterRegistryABI = require('../contracts/VoterRegistry.json').abi;
      const electionManagerABI = require('../contracts/ElectionManager.json').abi;

      const voterRegistryAddress = process.env.VOTER_REGISTRY_ADDRESS;
      const electionManagerAddress = process.env.ELECTION_MANAGER_ADDRESS;

      if (!voterRegistryAddress || !electionManagerAddress) {
        throw new Error('Contract addresses not configured');
      }

      this.voterRegistry = new ethers.Contract(
        voterRegistryAddress,
        voterRegistryABI,
        this.signer
      );

      this.electionManager = new ethers.Contract(
        electionManagerAddress,
        electionManagerABI,
        this.signer
      );

      logger.info('Blockchain service initialized');
    } catch (error) {
      logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  async createElection(electionData) {
    try {
      const tx = await this.electionManager.createElection(
        electionData.name,
        electionData.description,
        electionData.startTime,
        electionData.endTime,
        electionData.privacyMode === 'commit_only' ? 0 : electionData.privacyMode === 'commit_reveal' ? 1 : 2,
        electionData.ipfsCID
      );

      const receipt = await tx.wait();
      logger.info(`Election created: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('Error creating election on blockchain:', error);
      throw error;
    }
  }

  async addCandidate(electionId, name, description, ipfsCID) {
    try {
      const tx = await this.electionManager.addCandidate(
        electionId,
        name,
        description,
        ipfsCID
      );

      const receipt = await tx.wait();
      logger.info(`Candidate added: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('Error adding candidate on blockchain:', error);
      throw error;
    }
  }

  async startElection(electionId) {
    try {
      const tx = await this.electionManager.startElection(electionId);
      const receipt = await tx.wait();
      logger.info(`Election started: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('Error starting election on blockchain:', error);
      throw error;
    }
  }

  async closeElection(electionId) {
    try {
      const tx = await this.electionManager.closeElection(electionId);
      const receipt = await tx.wait();
      logger.info(`Election closed: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('Error closing election on blockchain:', error);
      throw error;
    }
  }

  async verifyVoter(voterAddress) {
    try {
      const tx = await this.voterRegistry.verifyVoter(voterAddress);
      const receipt = await tx.wait();
      logger.info(`Voter verified: ${receipt.hash}`);
      return receipt;
    } catch (error) {
      logger.error('Error verifying voter on blockchain:', error);
      throw error;
    }
  }

  async getElection(electionId) {
    try {
      const election = await this.electionManager.getElection(electionId);
      return election;
    } catch (error) {
      logger.error('Error fetching election from blockchain:', error);
      throw error;
    }
  }

  async hasVoted(electionId, voterAddress) {
    try {
      const hasVoted = await this.electionManager.hasVotedInElection(electionId, voterAddress);
      return hasVoted;
    } catch (error) {
      logger.error('Error checking vote status:', error);
      throw error;
    }
  }
}

const blockchainService = new BlockchainService();

module.exports = blockchainService;
