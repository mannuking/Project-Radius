const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'paid', 'overdue', 'disputed'),
    defaultValue: 'open'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  region: {
    type: DataTypes.STRING
  },
  outcomeStatus: {
    type: DataTypes.STRING
  },
  ptpStatus: {
    type: DataTypes.ENUM('pending', 'fulfilled', 'defaulted', 'none'),
    defaultValue: 'none'
  },
  ptpDate: {
    type: DataTypes.DATE
  },
  ptpAmount: {
    type: DataTypes.DECIMAL(10, 2)
  },
  lastContactDate: {
    type: DataTypes.DATE
  },
  nextFollowUpDate: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['dueDate']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['status']
    }
  ]
});

// Define associations
Invoice.associate = (models) => {
  Invoice.belongsTo(models.User, {
    foreignKey: 'assignedTo',
    as: 'assignee'
  });

  Invoice.hasMany(models.Comment, {
    foreignKey: 'invoiceId',
    as: 'comments'
  });

  Invoice.hasMany(models.Action, {
    foreignKey: 'invoiceId',
    as: 'actions'
  });
};

module.exports = Invoice; 
