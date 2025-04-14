import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Send as SendIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`invoice-tabpanel-${index}`}
      aria-labelledby={`invoice-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState('GENERAL');
  const [tabValue, setTabValue] = useState(0);
  const [auditTrail, setAuditTrail] = useState([]);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  
  // PTP dialog state
  const [ptpDialogOpen, setPtpDialogOpen] = useState(false);
  const [ptpDate, setPtpDate] = useState(null);
  const [ptpAmount, setPtpAmount] = useState('');
  const [ptpStatus, setPtpStatus] = useState('PENDING');
  const [ptpComment, setPtpComment] = useState('');
  
  // Action dialog state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('EMAIL_SENT');
  const [actionDescription, setActionDescription] = useState('');
  const [followUpDate, setFollowUpDate] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/invoices/${id}`);
      setInvoice(response.data);
      
      // Set PTP values if they exist
      if (response.data.ptpDate) {
        setPtpDate(new Date(response.data.ptpDate));
      }
      if (response.data.ptpAmount) {
        setPtpAmount(response.data.ptpAmount.toString());
      }
      if (response.data.ptpStatus) {
        setPtpStatus(response.data.ptpStatus);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditTrail = async () => {
    try {
      const response = await axios.get(`/api/invoices/${id}/audit-trail`);
      setAuditTrail(response.data);
    } catch (error) {
      console.error('Error fetching audit trail:', error);
    }
  };

  const handleChange = (field) => (event) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`/api/invoices/${id}`, invoice);
      // Show success message
    } catch (error) {
      console.error('Error saving invoice:', error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.put(`/api/invoices/${id}`, {
        comment: newComment,
        commentType: commentType,
      });
      setNewComment('');
      setCommentType('GENERAL');
      fetchInvoice(); // Refresh to get the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleAddPTP = async () => {
    try {
      await axios.post(`/api/invoices/${id}/ptp`, {
        ptpDate,
        ptpAmount: parseFloat(ptpAmount),
        ptpStatus,
        comment: ptpComment,
      });
      setPtpDialogOpen(false);
      fetchInvoice(); // Refresh to get the updated PTP
    } catch (error) {
      console.error('Error adding PTP:', error);
    }
  };

  const handleAddAction = async () => {
    try {
      await axios.post(`/api/invoices/${id}/action`, {
        type: actionType,
        description: actionDescription,
        followUpDate,
        followUpNotes,
      });
      setActionDialogOpen(false);
      setActionType('EMAIL_SENT');
      setActionDescription('');
      setFollowUpDate(null);
      setFollowUpNotes('');
      fetchInvoice(); // Refresh to get the new action
    } catch (error) {
      console.error('Error adding action:', error);
    }
  };

  const handleUpdateAction = async (actionId, completed) => {
    try {
      await axios.put(`/api/invoices/${id}/action`, {
        actionId,
        completed,
      });
      fetchInvoice(); // Refresh to get the updated action
    } catch (error) {
      console.error('Error updating action:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 2) { // Audit Trail tab
      fetchAuditTrail();
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW_DISPUTE: 'error',
      RESOLVED: 'success',
      PENDING_CLIENT_RESPONSE: 'warning',
      PAID: 'info',
      BLOCKED: 'error',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: 'success',
      MEDIUM: 'info',
      HIGH: 'warning',
      URGENT: 'error',
    };
    return colors[priority] || 'default';
  };

  const getPTPStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      FULFILLED: 'success',
      BROKEN: 'error',
      NOT_APPLICABLE: 'default',
    };
    return colors[status] || 'default';
  };

  const getActionTypeIcon = (type) => {
    switch (type) {
      case 'EMAIL_SENT':
        return <AssignmentIcon />;
      case 'CALL_MADE':
        return <PersonIcon />;
      case 'DOCS_REQUESTED':
        return <AssignmentIcon />;
      case 'PAYMENT_RECEIVED':
        return <CheckCircleIcon />;
      case 'DISPUTE_RAISED':
        return <CancelIcon />;
      case 'ESCALATION':
        return <HistoryIcon />;
      default:
        return <AssignmentIcon />;
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!invoice) {
    return <Typography>Invoice not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/invoices')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Invoice Details</Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Details" />
          <Tab label="Status & Categorization" />
          <Tab label="Comments & Activity" />
          <Tab label="History" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={invoice.invoiceNumber}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer"
                value={invoice.customer}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                value={`$${invoice.amount.toFixed(2)}`}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                value={new Date(invoice.dueDate).toLocaleDateString()}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={invoice.outcomeStatus}
                  onChange={handleChange('outcomeStatus')}
                  label="Status"
                >
                  <MenuItem value="NEW_DISPUTE">New Dispute</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                  <MenuItem value="PENDING_CLIENT_RESPONSE">Pending Client Response</MenuItem>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="BLOCKED">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={invoice.priority}
                  onChange={handleChange('priority')}
                  label="Priority"
                >
                  <MenuItem value="LOW">Low</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HIGH">High</MenuItem>
                  <MenuItem value="URGENT">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Dispute Code</InputLabel>
                <Select
                  value={invoice.disputeCode}
                  onChange={handleChange('disputeCode')}
                  label="Dispute Code"
                >
                  <MenuItem value="BILLER_CLERICAL">Biller Clerical</MenuItem>
                  <MenuItem value="PRICING_ERROR">Pricing Error</MenuItem>
                  <MenuItem value="PAYMENT_TERMS">Payment Terms</MenuItem>
                  <MenuItem value="SERVICE_ISSUE">Service Issue</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Root Cause</InputLabel>
                <Select
                  value={invoice.rootCause}
                  onChange={handleChange('rootCause')}
                  label="Root Cause"
                >
                  <MenuItem value="INVOICE_INCORRECT">Invoice Incorrect</MenuItem>
                  <MenuItem value="PO_ISSUE">PO Issue</MenuItem>
                  <MenuItem value="CLIENT_REQUESTED_FLOAT">Client Requested Float</MenuItem>
                  <MenuItem value="CASH_FORECAST">Cash Forecast</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Escalation Level</InputLabel>
                <Select
                  value={invoice.escalationLevel}
                  onChange={handleChange('escalationLevel')}
                  label="Escalation Level"
                >
                  <MenuItem value="L1">L1</MenuItem>
                  <MenuItem value="L2">L2</MenuItem>
                  <MenuItem value="L3">L3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Promise-to-Pay Section */}
          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Promise-to-Pay (PTP)
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="PTP Amount"
                  value={invoice.ptpAmount ? `$${invoice.ptpAmount.toFixed(2)}` : 'Not set'}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="PTP Date"
                  value={invoice.ptpDate ? new Date(invoice.ptpDate).toLocaleDateString() : 'Not set'}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>PTP Status</InputLabel>
                  <Select
                    value={invoice.ptpStatus || 'NOT_APPLICABLE'}
                    onChange={handleChange('ptpStatus')}
                    label="PTP Status"
                  >
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="FULFILLED">Fulfilled</MenuItem>
                    <MenuItem value="BROKEN">Broken</MenuItem>
                    <MenuItem value="NOT_APPLICABLE">Not Applicable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setPtpDialogOpen(true)}
              >
                Update PTP
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={invoice.outcomeStatus} onChange={handleChange('outcomeStatus')}>
                    <MenuItem value="NEW_DISPUTE">New Dispute</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                    <MenuItem value="PENDING_CLIENT_RESPONSE">Pending Client Response</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="BLOCKED">Blocked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Root Cause</InputLabel>
                  <Select value={invoice.rootCause} onChange={handleChange('rootCause')}>
                    <MenuItem value="INVOICE_INCORRECT">Invoice Incorrect</MenuItem>
                    <MenuItem value="PO_ISSUE">PO Issue</MenuItem>
                    <MenuItem value="CLIENT_REQUESTED_FLOAT">Client Requested Float</MenuItem>
                    <MenuItem value="CASH_FORECAST">Cash Forecast</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Outcome</InputLabel>
                  <Select value={invoice.outcomeStatus} onChange={handleChange('outcomeStatus')}>
                    <MenuItem value="NEW_DISPUTE">New Dispute</MenuItem>
                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                    <MenuItem value="PENDING_CLIENT_RESPONSE">Pending Client Response</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="BLOCKED">Blocked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Dispute Code</InputLabel>
                  <Select value={invoice.disputeCode} onChange={handleChange('disputeCode')}>
                    <MenuItem value="BILLER_CLERICAL">Biller Clerical</MenuItem>
                    <MenuItem value="PRICING_ERROR">Pricing Error</MenuItem>
                    <MenuItem value="PAYMENT_TERMS">Payment Terms</MenuItem>
                    <MenuItem value="SERVICE_ISSUE">Service Issue</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Box sx={{ mt: 1, textAlign: 'right' }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
              </Box>
            </Box>
            <List>
              {invoice.comments && invoice.comments.length > 0 ? (
                invoice.comments.map((comment, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        {comment.type === 'call' ? <PhoneIcon /> :
                         comment.type === 'email' ? <EmailIcon /> :
                         <CommentIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography component="span" variant="subtitle2">
                            {comment.author.username}
                          </Typography>
                          <Chip
                            label={comment.type}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(comment.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="body2">{comment.text}</Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No comments yet.
                </Typography>
              )}
            </List>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Audit Trail
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Old Value</TableCell>
                  <TableCell>New Value</TableCell>
                  <TableCell>Changed By</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditTrail.length > 0 ? (
                  auditTrail.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.field}</TableCell>
                      <TableCell>
                        {typeof entry.oldValue === 'object' && entry.oldValue !== null
                          ? JSON.stringify(entry.oldValue)
                          : entry.oldValue?.toString() || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {typeof entry.newValue === 'object' && entry.newValue !== null
                          ? JSON.stringify(entry.newValue)
                          : entry.newValue?.toString() || 'N/A'}
                      </TableCell>
                      <TableCell>{entry.changedBy?.username}</TableCell>
                      <TableCell>
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No audit trail available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* PTP Dialog */}
      <Dialog open={ptpDialogOpen} onClose={() => setPtpDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Promise-to-Pay (PTP)</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PTP Amount"
                type="number"
                value={ptpAmount}
                onChange={(e) => setPtpAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="PTP Date"
                  value={ptpDate}
                  onChange={(newValue) => setPtpDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>PTP Status</InputLabel>
                <Select
                  value={ptpStatus}
                  onChange={(e) => setPtpStatus(e.target.value)}
                  label="PTP Status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="FULFILLED">Fulfilled</MenuItem>
                  <MenuItem value="BROKEN">Broken</MenuItem>
                  <MenuItem value="NOT_APPLICABLE">Not Applicable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={3}
                value={ptpComment}
                onChange={(e) => setPtpComment(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPtpDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPTP} variant="contained">
            Save PTP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Action</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  label="Action Type"
                >
                  <MenuItem value="EMAIL_SENT">Email Sent</MenuItem>
                  <MenuItem value="CALL_MADE">Call Made</MenuItem>
                  <MenuItem value="DOCS_REQUESTED">Documents Requested</MenuItem>
                  <MenuItem value="PAYMENT_RECEIVED">Payment Received</MenuItem>
                  <MenuItem value="DISPUTE_RAISED">Dispute Raised</MenuItem>
                  <MenuItem value="ESCALATION">Escalation</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Follow-up Date"
                  value={followUpDate}
                  onChange={(newValue) => setFollowUpDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Follow-up Notes"
                multiline
                rows={2}
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddAction} 
            variant="contained"
            disabled={!actionDescription.trim()}
          >
            Add Action
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceDetail; 
