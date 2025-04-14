const Invoice = require('../models/Invoice');
const User = require('../models/User');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    
    // Fields to exclude
    const fieldsToRemove = ['select', 'sort', 'page', 'limit'];
    fieldsToRemove.forEach(param => delete queryObj[param]);
    
    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    let query = Invoice.find(JSON.parse(queryStr));
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Invoice.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const invoices = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: invoices.length,
      pagination,
      data: invoices
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('assignedTo', 'username firstName lastName')
      .populate('comments.user', 'username firstName lastName')
      .populate('actions.user', 'username firstName lastName')
      .populate('auditTrail.user', 'username firstName lastName');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;
    
    // Add audit trail entry
    req.body.auditTrail = [{
      action: 'created',
      user: req.user.id,
      timestamp: Date.now()
    }];
    
    const invoice = await Invoice.create(req.body);
    
    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
exports.updateInvoice = async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Add audit trail entry
    req.body.auditTrail = [
      ...invoice.auditTrail,
      {
        action: 'updated',
        user: req.user.id,
        timestamp: Date.now(),
        changes: req.body
      }
    ];
    
    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin, Manager)
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    await invoice.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add comment to invoice
// @route   POST /api/invoices/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Add comment
    invoice.comments.push({
      text: req.body.text,
      type: req.body.type || 'general',
      user: req.user.id
    });
    
    // Add audit trail entry
    invoice.auditTrail.push({
      action: 'comment_added',
      user: req.user.id,
      timestamp: Date.now()
    });
    
    await invoice.save();
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add action to invoice
// @route   POST /api/invoices/:id/actions
// @access  Private
exports.addAction = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Add action
    invoice.actions.push({
      type: req.body.type,
      description: req.body.description,
      dueDate: req.body.dueDate,
      user: req.user.id,
      status: 'pending'
    });
    
    // Add audit trail entry
    invoice.auditTrail.push({
      action: 'action_added',
      user: req.user.id,
      timestamp: Date.now()
    });
    
    await invoice.save();
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update action status
// @route   PUT /api/invoices/:id/actions/:actionId
// @access  Private
exports.updateActionStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Find action
    const action = invoice.actions.id(req.params.actionId);
    
    if (!action) {
      return res.status(404).json({ message: 'Action not found' });
    }
    
    // Update action status
    action.status = req.body.status;
    action.completedAt = req.body.status === 'completed' ? Date.now() : null;
    
    // Add audit trail entry
    invoice.auditTrail.push({
      action: 'action_updated',
      user: req.user.id,
      timestamp: Date.now()
    });
    
    await invoice.save();
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add PTP to invoice
// @route   POST /api/invoices/:id/ptp
// @access  Private
exports.addPTP = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Update PTP fields
    invoice.ptpStatus = 'active';
    invoice.ptpAmount = req.body.amount;
    invoice.ptpDate = req.body.date;
    invoice.ptpNotes = req.body.notes;
    
    // Add comment
    invoice.comments.push({
      text: `Promise to Pay added: ${req.body.amount} on ${new Date(req.body.date).toLocaleDateString()}`,
      type: 'ptp',
      user: req.user.id
    });
    
    // Add audit trail entry
    invoice.auditTrail.push({
      action: 'ptp_added',
      user: req.user.id,
      timestamp: Date.now()
    });
    
    await invoice.save();
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Assign invoice to user
// @route   PUT /api/invoices/:id/assign
// @access  Private
exports.assignInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Update assignment
    invoice.assignedTo = req.body.userId;
    
    // Add comment
    invoice.comments.push({
      text: `Invoice assigned to ${req.body.userId}`,
      type: 'assignment',
      user: req.user.id
    });
    
    // Add audit trail entry
    invoice.auditTrail.push({
      action: 'assigned',
      user: req.user.id,
      timestamp: Date.now()
    });
    
    await invoice.save();
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Bulk assign invoices
// @route   POST /api/invoices/bulk-assign
// @access  Private
exports.bulkAssignInvoices = async (req, res) => {
  try {
    const { invoiceIds, userId } = req.body;
    
    if (!invoiceIds || !userId) {
      return res.status(400).json({ message: 'Please provide invoice IDs and user ID' });
    }
    
    // Update all invoices
    const result = await Invoice.updateMany(
      { _id: { $in: invoiceIds } },
      { 
        $set: { 
          assignedTo: userId,
          lastUpdated: Date.now()
        },
        $push: {
          auditTrail: {
            action: 'bulk_assigned',
            user: req.user.id,
            timestamp: Date.now()
          }
        }
      }
    );
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get audit trail
// @route   GET /api/invoices/:id/audit
// @access  Private
exports.getAuditTrail = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .select('auditTrail')
      .populate('auditTrail.user', 'username firstName lastName');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.status(200).json({
      success: true,
      count: invoice.auditTrail.length,
      data: invoice.auditTrail
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 
