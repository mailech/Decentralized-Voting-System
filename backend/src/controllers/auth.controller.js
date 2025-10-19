const jwt = require('jsonwebtoken');
const db = require('../models');
const logger = require('../utils/logger');

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await db.Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await admin.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin);

    logger.info(`Admin logged in: ${username}`);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    logger.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingAdmin = await db.Admin.findOne({
      where: { [db.Sequelize.Op.or]: [{ username }, { email }] },
    });

    if (existingAdmin) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const admin = await db.Admin.create({
      username,
      email,
      password,
      role: role || 'election_manager',
    });

    logger.info(`Admin registered: ${username}`);

    res.status(201).json({
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    logger.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};

exports.getProfile = async (req, res) => {
  res.json({
    admin: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      lastLogin: req.user.lastLogin,
    },
  });
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const admin = await db.Admin.findByPk(decoded.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const newToken = generateToken(admin);

    res.json({ token: newToken });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    res.status(401).json({ error: 'Token refresh failed' });
  }
};
