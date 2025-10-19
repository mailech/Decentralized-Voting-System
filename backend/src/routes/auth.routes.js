const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.post(
  '/login',
  [
    body('username').notEmpty(),
    body('password').notEmpty(),
    validate,
  ],
  authController.login
);

router.post(
  '/register',
  [
    body('username').notEmpty().isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').optional().isIn(['election_manager', 'verifier', 'auditor']),
    validate,
  ],
  authController.register
);

router.post('/logout', auth.verifyToken, authController.logout);

router.get('/me', auth.verifyToken, authController.getProfile);

router.post('/refresh', authController.refreshToken);

module.exports = router;
