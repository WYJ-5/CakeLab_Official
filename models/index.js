const { Sequelize } = require('sequelize');
require('dotenv').config();

// 建立 Sequelize 實例
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, 
  }
);

// 測試連線
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ 資料庫連線成功！');
  } catch (error) {
    console.error('❌ 無法連線到資料庫:', error);
  }
};

testConnection();

module.exports = sequelize;