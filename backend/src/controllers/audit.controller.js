const db = require('../models');
const logger = require('../utils/logger');

exports.getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const { action, entityType } = req.query;

    const where = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const { count, rows: logs } = await db.AuditLog.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.Voter, as: 'user', attributes: ['walletAddress'] },
        { model: db.Election, as: 'election', attributes: ['name'] },
      ],
    });

    res.json({
      logs,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

exports.getElectionAuditLogs = async (req, res) => {
  try {
    const { electionId } = req.params;

    const logs = await db.AuditLog.findAll({
      where: { electionId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.Voter, as: 'user', attributes: ['walletAddress'] },
      ],
    });

    res.json({ logs });
  } catch (error) {
    logger.error('Error fetching election audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch election audit logs' });
  }
};
