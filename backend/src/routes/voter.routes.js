const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const voterController = require('../controllers/voter.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/voters/register:
 *   post:
 *     summary: Register a new voter
 *     tags: [Voters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - identityHash
 *             properties:
 *               walletAddress:
 *                 type: string
 *               identityHash:
 *                 type: string
 *               ipfsCID:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Voter registered successfully
 */
router.post(
  '/register',
  [
    body('walletAddress').isEthereumAddress().withMessage('Invalid wallet address'),
    body('identityHash').notEmpty().withMessage('Identity hash required'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    validate,
  ],
  voterController.register
);

/**
 * @swagger
 * /api/voters/{walletAddress}:
 *   get:
 *     summary: Get voter details
 *     tags: [Voters]
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voter details
 */
router.get(
  '/:walletAddress',
  [
    param('walletAddress').isEthereumAddress(),
    validate,
  ],
  voterController.getVoter
);

/**
 * @swagger
 * /api/voters/{walletAddress}/verify:
 *   post:
 *     summary: Verify a voter (admin only)
 *     tags: [Voters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voter verified successfully
 */
router.post(
  '/:walletAddress/verify',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'verifier']),
    param('walletAddress').isEthereumAddress(),
    validate,
  ],
  voterController.verifyVoter
);

/**
 * @swagger
 * /api/voters:
 *   get:
 *     summary: Get all voters (admin only)
 *     tags: [Voters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of voters
 */
router.get(
  '/',
  [
    auth.verifyToken,
    auth.requireRole(['super_admin', 'verifier', 'auditor']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate,
  ],
  voterController.getAllVoters
);

module.exports = router;
