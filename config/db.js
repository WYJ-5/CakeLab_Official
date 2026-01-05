// config/db.js
require('dotenv').config(); 
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

require('dotenv').config();
console.log('--- 環境變數檢查 ---');
console.log('DB_USER:', process.env.DB_USERNAME);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('------------------');

module.exports = sequelize;