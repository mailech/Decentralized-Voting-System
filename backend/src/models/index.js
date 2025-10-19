const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
  }
);

const db = {};

// Import models
db.Voter = require('./voter.model')(sequelize, Sequelize.DataTypes);
db.Election = require('./election.model')(sequelize, Sequelize.DataTypes);
db.Candidate = require('./candidate.model')(sequelize, Sequelize.DataTypes);
db.Vote = require('./vote.model')(sequelize, Sequelize.DataTypes);
db.AuditLog = require('./auditLog.model')(sequelize, Sequelize.DataTypes);
db.Admin = require('./admin.model')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
