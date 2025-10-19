module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define('Candidate', {
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
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'On-chain candidate ID',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipfsCID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    voteCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'candidates',
    timestamps: true,
    indexes: [
      { fields: ['electionId'] },
      { fields: ['candidateId'] },
      { fields: ['electionId', 'candidateId'], unique: true },
    ],
  });

  Candidate.associate = (models) => {
    Candidate.belongsTo(models.Election, {
      foreignKey: 'electionId',
      as: 'election',
    });
    Candidate.hasMany(models.Vote, {
      foreignKey: 'candidateId',
      as: 'votes',
    });
  };

  return Candidate;
};
