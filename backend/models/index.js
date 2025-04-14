const User = require('./User');
const Invoice = require('./Invoice');
const Comment = require('./Comment');
const Action = require('./Action');

// Initialize associations
const initializeAssociations = () => {
  // User associations
  User.hasMany(Invoice, {
    foreignKey: 'assignedTo',
    as: 'assignedInvoices'
  });

  User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments'
  });

  User.hasMany(Action, {
    foreignKey: 'userId',
    as: 'actions'
  });

  // Invoice associations
  Invoice.associate({ User, Comment, Action });

  // Comment associations
  Comment.associate({ User, Invoice });

  // Action associations
  Action.associate({ User, Invoice });
};

module.exports = {
  User,
  Invoice,
  Comment,
  Action,
  initializeAssociations
}; 
