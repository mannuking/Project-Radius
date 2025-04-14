const { Op } = require('sequelize');
const { Invoice } = require('../models');

// Helper function to calculate aging buckets
const calculateAgingBuckets = (invoices) => {
  const buckets = {
    current: 0,
    '1_30': 0,
    '31_60': 0,
    '61_90': 0,
    'over_90': 0
  };

  invoices.forEach(invoice => {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    if (daysOverdue <= 0) {
      buckets.current += parseFloat(invoice.amount);
    } else if (daysOverdue <= 30) {
      buckets['1_30'] += parseFloat(invoice.amount);
    } else if (daysOverdue <= 60) {
      buckets['31_60'] += parseFloat(invoice.amount);
    } else if (daysOverdue <= 90) {
      buckets['61_90'] += parseFloat(invoice.amount);
    } else {
      buckets['over_90'] += parseFloat(invoice.amount);
    }
  });

  return buckets;
};

// Get aging report
const getAgingReport = async (req, res) => {
  try {
    // Get all open invoices
    const openInvoices = await Invoice.findAll({
      where: {
        status: {
          [Op.not]: 'paid'
        }
      },
      include: [{
        association: 'assignee',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    // Calculate aging buckets
    const agingBuckets = calculateAgingBuckets(openInvoices);

    // Get top 10 overdue invoices by amount
    const topOverdueInvoices = await Invoice.findAll({
      where: {
        status: 'overdue'
      },
      include: [{
        association: 'assignee',
        attributes: ['id', 'firstName', 'lastName']
      }],
      order: [['amount', 'DESC']],
      limit: 10
    });

    // Calculate weekly trend (last 12 weeks)
    const weeklyTrend = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() - 7);

      const weekInvoices = await Invoice.findAll({
        where: {
          status: {
            [Op.not]: 'paid'
          },
          dueDate: {
            [Op.between]: [weekEnd, weekStart]
          }
        }
      });

      weeklyTrend.unshift({
        weekStarting: weekEnd,
        ...calculateAgingBuckets(weekInvoices)
      });
    }

    res.json({
      success: true,
      data: {
        agingBuckets,
        topOverdueInvoices,
        weeklyTrend
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get region-based report data
 * @route GET /api/reports/regions
 * @access Private
 */
const getRegionReport = async (req, res) => {
    try {
        // Get all invoices grouped by region
        const regionSummary = await Invoice.aggregate([
            {
                $group: {
                    _id: '$region',
                    totalInvoices: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    paidAmount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0]
                        }
                    },
                    overdueAmount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$status', 'open'] },
                                        { $lt: ['$dueDate', new Date()] }
                                    ]
                                },
                                '$amount',
                                0
                            ]
                        }
                    },
                    avgDaysToPayment: {
                        $avg: {
                            $cond: [
                                { $eq: ['$status', 'paid'] },
                                {
                                    $divide: [
                                        { $subtract: ['$paidDate', '$issueDate'] },
                                        1000 * 60 * 60 * 24 // Convert milliseconds to days
                                    ]
                                },
                                null
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    region: '$_id',
                    totalInvoices: 1,
                    totalAmount: 1,
                    paidAmount: 1,
                    overdueAmount: 1,
                    collectionRate: {
                        $multiply: [
                            { $divide: ['$paidAmount', '$totalAmount'] },
                            100
                        ]
                    },
                    avgDaysToPayment: { $round: ['$avgDaysToPayment', 1] }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Get monthly trends by region for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrends = await Invoice.aggregate([
            {
                $match: {
                    issueDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        region: '$region',
                        year: { $year: '$issueDate' },
                        month: { $month: '$issueDate' }
                    },
                    totalAmount: { $sum: '$amount' },
                    paidAmount: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    region: '$_id.region',
                    year: '$_id.year',
                    month: '$_id.month',
                    totalAmount: 1,
                    paidAmount: 1,
                    collectionRate: {
                        $multiply: [
                            { $divide: ['$paidAmount', '$totalAmount'] },
                            100
                        ]
                    }
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]);

        // Get top overdue invoices by region
        const topOverdueByRegion = await Invoice.aggregate([
            {
                $match: {
                    status: 'open',
                    dueDate: { $lt: new Date() }
                }
            },
            {
                $group: {
                    _id: '$region',
                    invoices: {
                        $push: {
                            invoiceNumber: '$invoiceNumber',
                            customer: '$customer',
                            amount: '$amount',
                            dueDate: '$dueDate',
                            daysOverdue: {
                                $divide: [
                                    { $subtract: [new Date(), '$dueDate'] },
                                    1000 * 60 * 60 * 24
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    region: '$_id',
                    topOverdue: { $slice: ['$invoices', 5] }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                regionSummary,
                monthlyTrends,
                topOverdueByRegion
            }
        });
    } catch (error) {
        console.error('Error generating region report:', error);
        res.status(500).json({
            success: false,
            error: 'Error generating region report'
        });
    }
};

module.exports = {
    getAgingReport,
    getRegionReport
}; 
