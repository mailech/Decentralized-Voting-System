const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const voteController = require('../controllers/vote.controller');
const validate = require('../middleware/validate');

router.post(
  '/',
  [
    body('electionId').isUUID(),
    body('walletAddress').isEthereumAddress(),
    body('voteCommitment').notEmpty(),
    body('txHash').notEmpty(),
    validate,
  ],
  voteController.submitVote
);

router.get(
  '/verify/:txHash',
  [param('txHash').notEmpty(), validate],
  voteController.verifyVote
);

router.get(
  '/election/:electionId/voter/:walletAddress',
  [
    param('electionId').isUUID(),
    param('walletAddress').isEthereumAddress(),
    validate,
  ],
  voteController.getVoteByElectionAndVoter
);

module.exports = router;
