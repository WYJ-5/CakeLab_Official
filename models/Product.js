const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    img: { type: DataTypes.STRING }, 
    description: { type: DataTypes.TEXT },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    timestamps: true 
});

module.exports = Product;