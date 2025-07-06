const { Sequelize } = require('sequelize');
require('dotenv').config();

// buat instance Sequelize untuk koneksi database
const sequelize = new Sequelize(
  process.env.DB_NAME,      // nama database dari file .env
  process.env.DB_USER,      // user database dari file .env
  process.env.DB_PASSWORD,  // Password database dari file .env
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    dialect: 'mysql'           
  }
);

// Fungsi untuk mengecek koneksi
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Ekspor instance dan fungsi koneksi
module.exports = { sequelize, connectDB };