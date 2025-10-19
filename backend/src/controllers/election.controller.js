const db = require('../models');
const logger = require('../utils/logger');
const blockchainService = require('../services/blockchain.service');
const auditService = require('../services/audit.service');

exports.createElection = async (req, res) => {
  try {
    const { name, description, startTime, endTime, privacyMode, ipfsCID } = req.body;

    // Create election on blockchain
    const txReceipt = await blockchainService.createElection({
      name,
      description,
      startTime: new Date(startTime).getTime() / 1000,
      endTime: new Date(endTime).getTime() / 1000,
      privacyMode,
      ipfsCID: ipfsCID || '',
    });

    const electionId = txReceipt.events.ElectionCreated.returnValues.electionId;

    // Save to database
    const election = await db.Election.create({
      electionId: parseInt(electionId),
      name,
      description,
      startTime,
      endTime,
      privacyMode,
      ipfsCID,
      creationTxHash: txReceipt.transactionHash,
    });

    await auditService.log({
      action: 'election_created',
      entityType: 'election',
      entityId: election.id,
      electionId: election.id,
      userId: req.user.id,
      details: { name, electionId },
      txHash: txReceipt.transactionHash,
      ipAddress: req.ip,
    });

    logger.info(`Election created: ${name} (ID: ${electionId})`);

    res.status(201).json({ message: 'Election created successfully', election });
  } catch (error) {
    logger.error('Error creating election:', error);
    res.status(500).json({ error: 'Failed to create election' });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await db.Election.findAll({
      include: [{ model: db.Candidate, as: 'candidates' }],
      order: [['createdAt', 'DESC']],
    });

    res.json({ elections });
  } catch (error) {
    logger.error('Error fetching elections:', error);
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
};

exports.getElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await db.Election.findByPk(electionId, {
      include: [{ model: db.Candidate, as: 'candidates' }],
    });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    res.json({ election });
  } catch (error) {
    logger.error('Error fetching election:', error);
    res.status(500).json({ error: 'Failed to fetch election' });
  }
};

exports.addCandidate = async (req, res) => {
  try {
    const { electionId } = req.params;
    const { name, description, ipfsCID, imageUrl } = req.body;

    const election = await db.Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (election.status !== 'created') {
      return res.status(400).json({ error: 'Cannot add candidates to active election' });
    }

    // Add candidate on blockchain
    const txReceipt = await blockchainService.addCandidate(
      election.electionId,
      name,
      description,
      ipfsCID || ''
    );

    const candidateId = txReceipt.events.CandidateAdded.returnValues.candidateId;

    const candidate = await db.Candidate.create({
      electionId,
      candidateId: parseInt(candidateId),
      name,
      description,
      ipfsCID,
      imageUrl,
    });

    await auditService.log({
      action: 'candidate_added',
      entityType: 'candidate',
      entityId: candidate.id,
      electionId,
      userId: req.user.id,
      details: { name, candidateId },
      txHash: txReceipt.transactionHash,
      ipAddress: req.ip,
    });

    logger.info(`Candidate added: ${name} to election ${election.name}`);

    res.status(201).json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    logger.error('Error adding candidate:', error);
    res.status(500).json({ error: 'Failed to add candidate' });
  }
};

exports.startElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await db.Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const txReceipt = await blockchainService.startElection(election.electionId);

    election.status = 'active';
    await election.save();

    await auditService.log({
      action: 'election_started',
      entityType: 'election',
      entityId: election.id,
      electionId,
      userId: req.user.id,
      txHash: txReceipt.transactionHash,
      ipAddress: req.ip,
    });

    res.json({ message: 'Election started successfully', election });
  } catch (error) {
    logger.error('Error starting election:', error);
    res.status(500).json({ error: 'Failed to start election' });
  }
};

exports.closeElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await db.Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const txReceipt = await blockchainService.closeElection(election.electionId);

    election.status = 'closed';
    election.closeTxHash = txReceipt.transactionHash;
    await election.save();

    await auditService.log({
      action: 'election_closed',
      entityType: 'election',
      entityId: election.id,
      electionId,
      userId: req.user.id,
      txHash: txReceipt.transactionHash,
      ipAddress: req.ip,
    });

    res.json({ message: 'Election closed successfully', election });
  } catch (error) {
    logger.error('Error closing election:', error);
    res.status(500).json({ error: 'Failed to close election' });
  }
};

exports.getResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await db.Election.findByPk(electionId, {
      include: [{ model: db.Candidate, as: 'candidates' }],
    });

    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    if (!election.resultsPublished) {
      return res.status(400).json({ error: 'Results not yet published' });
    }

    res.json({
      election: {
        id: election.id,
        name: election.name,
        totalVotes: election.totalVotes,
        status: election.status,
      },
      candidates: election.candidates.map(c => ({
        id: c.id,
        name: c.name,
        voteCount: c.voteCount,
        percentage: election.totalVotes > 0 ? (c.voteCount / election.totalVotes * 100).toFixed(2) : 0,
      })),
    });
  } catch (error) {
    logger.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
};
