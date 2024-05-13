const { DataTypes } = require('sequelize');

const db = require('../Connection/config');
const petModel = require('./pet.model');

const tutorModel = db.define('tutor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  zip_code: {
    type: DataTypes.STRING,
    allowNull: false,
  }

},
  {
    tableName: 'tutors',
    timestamps: false,
  },
)

module.exports = tutorModel