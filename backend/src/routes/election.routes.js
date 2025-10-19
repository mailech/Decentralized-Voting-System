const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const electionController = require('../controllers/election.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post(
  '/',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'election_manager']),
    body('name').notEmpty(),
    body('description').optional(),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
    body('privacyMode').isIn(['commit_only', 'commit_reveal', 'homomorphic']),
    validate,
  ],
  electionController.createElection
);

router.get('/', electionController.getAllElections);

router.get('/:electionId', [param('electionId').isUUID(), validate], electionController.getElection);

router.post(
  '/:electionId/candidates',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'election_manager']),
    param('electionId').isUUID(),
    body('name').notEmpty(),
    body('description').optional(),
    validate,
  ],
  electionController.addCandidate
);

router.post(
  '/:electionId/start',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'election_manager']),
    param('electionId').isUUID(),
    validate,
  ],
  electionController.startElection
);

router.post(
  '/:electionId/close',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'election_manager']),
    param('electionId').isUUID(),
    validate,
  ],
  electionController.closeElection
);

router.get('/:electionId/results', [param('electionId').isUUID(), validate], electionController.getResults);

module.exports = router;
