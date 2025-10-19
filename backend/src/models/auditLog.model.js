module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.ENUM('voter', 'election', 'candidate', 'vote', 'admin'),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    electionId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'audit_logs',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['action'] },
      { fields: ['entityType'] },
      { fields: ['userId'] },
      { fields: ['electionId'] },
      { fields: ['createdAt'] },
    ],
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.Voter, {
      foreignKey: 'userId',
      as: 'user',
    });
    AuditLog.belongsTo(models.Election, {
      foreignKey: 'electionId',
      as: 'election',
    });
  };

  return AuditLog;
};
