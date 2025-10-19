const express = require('express');
const router = express.Router();
const { query, param } = require('express-validator');
const auditController = require('../controllers/audit.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.get(
  '/',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'auditor']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('action').optional(),
    query('entityType').optional(),
    validate,
  ],
  auditController.getAuditLogs
);

router.get(
  '/election/:electionId',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'auditor', 'election_manager']),
    param('electionId').isUUID(),
    validate,
  ],
  auditController.getElectionAuditLogs
);

module.exports = router;
