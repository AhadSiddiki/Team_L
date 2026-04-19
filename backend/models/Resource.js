// backend/models/Resource.js
const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConfig');

// creating the Resource model mapping strictly to id, name, type, capacity
const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false // matching simple sql structure
});

module.exports = Resource;
