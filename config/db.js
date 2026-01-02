// config/db.js
require('dotenv').config(); // 務必確保這一行在最上面！
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME, // 如果這裡抓不到，就會變成 ''
    process.env.DB_PASSWORD, // 如果這裡抓不到，就會變成 NO password
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