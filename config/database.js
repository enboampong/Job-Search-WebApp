const Sequelize = require('sequelize');

module.exports = new Sequelize('codejobs', 'root', '', {
    host: 'localhost',
    dialect:  'mysql' 
  });
