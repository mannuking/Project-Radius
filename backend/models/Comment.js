const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('general', 'dispute', 'resolution', 'ptp', 'assignment'),
    defaultValue: 'general'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Invoices',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Define associations
Comment.associate = (models) => {
  Comment.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Comment.belongsTo(models.Invoice, {
    foreignKey: 'invoiceId',
    as: 'invoice'
  });
};

module.exports = Comment; 
