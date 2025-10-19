module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    electionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'elections',
        key: 'id',
      },
    },
    voterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'voters',
        key: 'id',
      },
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'candidates',
        key: 'id',
      },
    },
    voteCommitment: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Encrypted vote commitment hash',
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    revealed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    revealedCandidateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    revealTxHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ipfsCID: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'IPFS reference for encrypted vote data',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'votes',
    timestamps: true,
    indexes: [
      { fields: ['electionId'] },
      { fields: ['voterId'] },
      { fields: ['txHash'] },
      { fields: ['electionId', 'voterId'], unique: true },
    ],
  });

  Vote.associate = (models) => {
    Vote.belongsTo(models.Election, {
      foreignKey: 'electionId',
      as: 'election',
    });
    Vote.belongsTo(models.Voter, {
      foreignKey: 'voterId',
      as: 'voter',
    });
    Vote.belongsTo(models.Candidate, {
      foreignKey: 'candidateId',
      as: 'candidate',
    });
  };

  return Vote;
};
