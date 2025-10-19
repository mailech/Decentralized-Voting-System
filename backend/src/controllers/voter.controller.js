const db = require('../models');
const logger = require('../utils/logger');
const auditService = require('../services/audit.service');

exports.register = async (req, res) => {
  try {
    const { walletAddress, identityHash, ipfsCID, email, phoneNumber } = req.body;

    const existingVoter = await db.Voter.findOne({ where: { walletAddress } });
    if (existingVoter) {
      return res.status(409).json({ error: 'Voter already registered' });
    }

    const voter = await db.Voter.create({
      walletAddress,
      identityHash,
      ipfsCID,
      email,
      phoneNumber,
      isRegistered: true,
    });

    await auditService.log({
      action: 'voter_registered',
      entityType: 'voter',
      entityId: voter.id,
      details: { walletAddress },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Voter registered: ${walletAddress}`);

    res.status(201).json({
      message: 'Voter registered successfully',
      voter: {
        id: voter.id,
        walletAddress: voter.walletAddress,
        isRegistered: voter.isRegistered,
        isVerified: voter.isVerified,
      },
    });
  } catch (error) {
    logger.error('Error registering voter:', error);
    res.status(500).json({ error: 'Failed to register voter' });
  }
};

exports.getVoter = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const voter = await db.Voter.findOne({ where: { walletAddress } });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    res.json({
      id: voter.id,
      walletAddress: voter.walletAddress,
      isRegistered: voter.isRegistered,
      isVerified: voter.isVerified,
      registeredAt: voter.registeredAt,
      verifiedAt: voter.verifiedAt,
      kycStatus: voter.kycStatus,
    });
  } catch (error) {
    logger.error('Error fetching voter:', error);
    res.status(500).json({ error: 'Failed to fetch voter' });
  }
};

exports.verifyVoter = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const voter = await db.Voter.findOne({ where: { walletAddress } });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    if (voter.isVerified) {
      return res.status(400).json({ error: 'Voter already verified' });
    }

    voter.isVerified = true;
    voter.verifiedAt = new Date();
    voter.kycStatus = 'approved';
    await voter.save();

    await auditService.log({
      action: 'voter_verified',
      entityType: 'voter',
      entityId: voter.id,
      userId: req.user.id,
      details: { walletAddress, verifiedBy: req.user.username },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    logger.info(`Voter verified: ${walletAddress} by ${req.user.username}`);

    res.json({
      message: 'Voter verified successfully',
      voter: {
        id: voter.id,
        walletAddress: voter.walletAddress,
        isVerified: voter.isVerified,
        verifiedAt: voter.verifiedAt,
      },
    });
  } catch (error) {
    logger.error('Error verifying voter:', error);
    res.status(500).json({ error: 'Failed to verify voter' });
  }
};

exports.getAllVoters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const verified = req.query.verified;

    const where = {};
    if (verified !== undefined) {
      where.isVerified = verified === 'true';
    }

    const { count, rows: voters } = await db.Voter.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'walletAddress', 'isRegistered', 'isVerified', 'kycStatus', 'registeredAt', 'verifiedAt'],
    });

    res.json({
      voters,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching voters:', error);
    res.status(500).json({ error: 'Failed to fetch voters' });
  }
};
