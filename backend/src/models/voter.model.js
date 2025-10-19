module.exports = (sequelize, DataTypes) => {
  const Voter = sequelize.define('Voter', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    walletAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: /^0x[a-fA-F0-9]{40}$/,
      },
    },
    identityHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    ipfsCID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    registrationTxHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verificationTxHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    kycStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    kycData: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'voters',
    timestamps: true,
    indexes: [
      { fields: ['walletAddress'] },
      { fields: ['identityHash'] },
      { fields: ['isVerified'] },
    ],
  });

  Voter.associate = (models) => {
    Voter.hasMany(models.Vote, {
      foreignKey: 'voterId',
      as: 'votes',
    });
    Voter.hasMany(models.AuditLog, {
      foreignKey: 'userId',
      as: 'auditLogs',
    });
  };

  return Voter;
};
