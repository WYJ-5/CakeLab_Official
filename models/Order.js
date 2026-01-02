const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // 這裡路徑要對準你的 db 設定檔

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickup_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    cake_item_string: {
        type: DataTypes.TEXT, // 存入 JSON 字串
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'orders'
});

module.exports = Order;