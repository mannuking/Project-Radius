const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Action = sequelize.define('Action', {
  type: {
    type: DataTypes.ENUM(
      'call',
      'email',
      'letter',
      'meeting',
      'payment_received',
      'payment_plan',
      'dispute_raised',
      'dispute_resolved',
      'other'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE
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
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  completedAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

// Define associations
Action.associate = (models) => {
  Action.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Action.belongsTo(models.Invoice, {
    foreignKey: 'invoiceId',
    as: 'invoice'
  });
};

module.exports = Action; 
