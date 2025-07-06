// config/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Buat instance Sequelize untuk koneksi database
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Nama database dari file .env
  process.env.DB_USER,      // User database dari file .env
  process.env.DB_PASSWORD,  // Password database dari file .env
  {
    host: process.env.DB_HOST, // Host database (misal: 'localhost') dari file .env
    dialect: 'mysql'           // Kita memberitahu Sequelize bahwa kita menggunakan MySQL
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