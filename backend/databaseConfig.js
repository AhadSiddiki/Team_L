// backend/databaseConfig.js
const { Sequelize } = require('sequelize');

// reading environment variables or using defaults, like a student would simply put here
const sequelize = new Sequelize(
    process.env.DB_NAME || 'spacesync_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false // keeping console clean
    }
);

// testing the connection to the db
async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Successfully connected to the database.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connectDB();

module.exports = sequelize;
