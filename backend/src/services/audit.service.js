const db = require('../models');
const logger = require('../utils/logger');

class AuditService {
  async log(data) {
    try {
      const auditLog = await db.AuditLog.create({
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        electionId: data.electionId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        txHash: data.txHash,
        success: data.success !== undefined ? data.success : true,
        errorMessage: data.errorMessage,
      });

      return auditLog;
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  async getLogsByEntity(entityType, entityId) {
    try {
      const logs = await db.AuditLog.findAll({
        where: { entityType, entityId },
        order: [['createdAt', 'DESC']],
      });

      return logs;
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  async getLogsByElection(electionId) {
    try {
      const logs = await db.AuditLog.findAll({
        where: { electionId },
        order: [['createdAt', 'DESC']],
      });

      return logs;
    } catch (error) {
      logger.error('Error fetching election audit logs:', error);
      throw error;
    }
  }
}

const auditService = new AuditService();

module.exports = auditService;
