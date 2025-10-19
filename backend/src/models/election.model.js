module.exports = (sequelize, DataTypes) => {
  const Election = sequelize.define('Election', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    electionId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      comment: 'On-chain election ID',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('created', 'active', 'closed', 'tallied'),
      defaultValue: 'created',
    },
    privacyMode: {
      type: DataTypes.ENUM('commit_only', 'commit_reveal', 'homomorphic'),
      defaultValue: 'commit_only',
    },
    ipfsCID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalVotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    resultsPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    creationTxHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    closeTxHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tallyTxHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'elections',
    timestamps: true,
    indexes: [
      { fields: ['electionId'] },
      { fields: ['status'] },
      { fields: ['startTime'] },
      { fields: ['endTime'] },
    ],
  });

  Election.associate = (models) => {
    Election.hasMany(models.Candidate, {
      foreignKey: 'electionId',
      as: 'candidates',
      onDelete: 'CASCADE',
    });
    Election.hasMany(models.Vote, {
      foreignKey: 'electionId',
      as: 'votes',
      onDelete: 'CASCADE',
    });
    Election.hasMany(models.AuditLog, {
      foreignKey: 'electionId',
      as: 'auditLogs',
    });
  };

  return Election;
};
