const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
  dialect: 'sqlite',
  host: process.env.HOST,
  storage: "./src/Infrastructure/database/Connection/app.db",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}, )

module.exports = sequelize