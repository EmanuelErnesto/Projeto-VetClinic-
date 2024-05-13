const { DataTypes } = require('sequelize');

const db = require('../Connection/config');
const tutorModel = require('./tutor.model');

const petModel = db.define('pet', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  species: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carry: {
    type: DataTypes.CHAR,
    allowNull: false
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_of_birth: {
    type: DataTypes.DATE,
    allowNull: false
  },

},
  {
    tableName: 'pets'

  },
)

tutorModel.hasMany(petModel)
petModel.belongsTo(tutorModel, {
  foreignKey: 'tutorId',
  allowNull: false
})

module.exports = petModel