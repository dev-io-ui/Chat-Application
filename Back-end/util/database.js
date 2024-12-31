const Sequelize = require('sequelize');

const sequelize = new Sequelize('Group-Chat-App','root','root',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;