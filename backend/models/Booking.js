// backend/models/Booking.js
const { DataTypes } = require('sequelize');
const sequelize = require('../databaseConfig');
const Resource = require('./Resource');
const User = require('./User'); // bringing in user

// creating the Booking model mapped strictly to id, resource_id, user_id, booking_date, status
const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    resource_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Resource,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Confirmed'
    }
}, {
    timestamps: false
});

// Associations
Resource.hasMany(Booking, { foreignKey: 'resource_id' });
Booking.belongsTo(Resource, { foreignKey: 'resource_id' });

User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Booking;
