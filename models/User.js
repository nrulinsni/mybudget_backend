// models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Impor instance sequelize
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    // Nama 'User' akan otomatis menjadi nama tabel 'users'
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true // Otomatis menambahkan createdAt dan updatedAt
});

// Sequelize Hooks (pengganti Mongoose pre-save) untuk hash password
User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

// Instance method (pengganti Mongoose methods) untuk membandingkan password
User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;