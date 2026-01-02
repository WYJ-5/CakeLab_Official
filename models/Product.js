const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING }, // 建議統一使用 img 避免 image_url 混淆
    description: { type: DataTypes.TEXT },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true // 這會產生 createdAt 和 updatedAt，如果你不需要請設為 false
});

module.exports = Product;