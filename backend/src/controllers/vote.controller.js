const db = require('../models');
const logger = require('../utils/logger');
const auditService = require('../services/audit.service');

exports.submitVote = async (req, res) => {
  try {
    const { electionId, walletAddress, voteCommitment, txHash, ipfsCID } = req.body;

    const election = await db.Election.findByPk(electionId);
    if (!election) {
      return res.status(404).json({ error: 'Election not found' });
    }

    const voter = await db.Voter.findOne({ where: { walletAddress } });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    const existingVote = await db.Vote.findOne({
      where: { electionId, voterId: voter.id },
    });

    if (existingVote) {
      return res.status(409).json({ error: 'Vote already submitted' });
    }

    const vote = await db.Vote.create({
      electionId,
      voterId: voter.id,
      voteCommitment,
      txHash,
      ipfsCID,
      timestamp: new Date(),
    });

    election.totalVotes += 1;
    await election.save();

    await auditService.log({
      action: 'vote_submitted',
      entityType: 'vote',
      entityId: vote.id,
      userId: voter.id,
      electionId,
      details: { txHash },
      txHash,
      ipAddress: req.ip,
    });

    logger.info(`Vote submitted: ${txHash}`);

    res.status(201).json({
      message: 'Vote submitted successfully',
      vote: {
        id: vote.id,
        txHash: vote.txHash,
        timestamp: vote.timestamp,
      },
    });
  } catch (error) {
    logger.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
};

exports.verifyVote = async (req, res) => {
  try {
    const { txHash } = req.params;

    const vote = await db.Vote.findOne({
      where: { txHash },
      include: [
        { model: db.Election, as: 'election' },
        { model: db.Voter, as: 'voter', attributes: ['walletAddress'] },
      ],
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({
      verified: true,
      vote: {
        txHash: vote.txHash,
        timestamp: vote.timestamp,
        electionName: vote.election.name,
        voteCommitment: vote.voteCommitment,
        blockNumber: vote.blockNumber,
      },
    });
  } catch (error) {
    logger.error('Error verifying vote:', error);
    res.status(500).json({ error: 'Failed to verify vote' });
  }
};

exports.getVoteByElectionAndVoter = async (req, res) => {
  try {
    const { electionId, walletAddress } = req.params;

    const voter = await db.Voter.findOne({ where: { walletAddress } });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    const vote = await db.Vote.findOne({
      where: { electionId, voterId: voter.id },
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({
      vote: {
        id: vote.id,
        txHash: vote.txHash,
        timestamp: vote.timestamp,
        voteCommitment: vote.voteCommitment,
      },
    });
  } catch (error) {
    logger.error('Error fetching vote:', error);
    res.status(500).json({ error: 'Failed to fetch vote' });
  }
};
