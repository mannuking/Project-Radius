import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import {
  Search,
  FilterList,
  NavigateNext,
  Assignment,
  PersonAdd,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data - Replace with actual API calls
const mockData = Array.from({ length: 50 }, (_, index) => ({
  id: `INV-2024-${(index + 1).toString().padStart(4, '0')}`,
  customerName: `Customer ${index + 1}`,
  dueDate: new Date(2024, 0, index + 1).toISOString(),
  ageInDays: Math.floor(Math.random() * 120),
  amountDue: Math.floor(Math.random() * 10000),
  status: ['NEW', 'IN_PROGRESS', 'RESOLVED'][Math.floor(Math.random() * 3)],
  disputeCode: Math.random() > 0.7 ? 'PRICING' : null,
  assignedTo: Math.random() > 0.3 ? `User ${Math.floor(Math.random() * 5) + 1}` : null,
  team: ['Team A', 'Team B', 'Team C'][Math.floor(Math.random() * 3)],
}));

// Mock users for assignment
const mockUsers = [
  { id: 1, name: 'John Doe', team: 'Team A', role: 'collector' },
  { id: 2, name: 'Jane Smith', team: 'Team A', role: 'biller' },
  { id: 3, name: 'Mike Johnson', team: 'Team B', role: 'collector' },
  { id: 4, name: 'Sarah Wilson', team: 'Team B', role: 'biller' },
  { id: 5, name: 'Tom Brown', team: 'Team C', role: 'collector' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'NEW':
      return 'error';
    case 'IN_PROGRESS':
      return 'warning';
    case 'RESOLVED':
      return 'success';
    default:
      return 'default';
  }
};

const InvoiceList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isDirector = currentUser?.role === 'director';
  const isOperations = currentUser?.role === 'operations';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('dueDate');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    team: 'all',
    assignedTo: 'all',
    disputeCode: 'all',
  });
  
  // Assignment dialog state
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
  };

  const handleAssign = async () => {
    // TODO: Implement actual assignment API call
    console.log('Assigning invoices:', selectedRows, 'to user:', selectedUser);
    setAssignmentDialogOpen(false);
    setSelectedRows([]);
    setSelectedUser('');
  };

  const filteredData = mockData
    .filter((row) => {
      const matchesSearch = (
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = filters.status === 'all' || row.status === filters.status;
      const matchesTeam = filters.team === 'all' || row.team === filters.team;
      const matchesAssigned = filters.assignedTo === 'all' || 
        (filters.assignedTo === 'unassigned' ? !row.assignedTo : row.assignedTo === filters.assignedTo);
      const matchesDispute = filters.disputeCode === 'all' || row.disputeCode === filters.disputeCode;
      
      return matchesSearch && matchesStatus && matchesTeam && matchesAssigned && matchesDispute;
    })
    .sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'amountDue' || orderBy === 'ageInDays') {
        return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
      }
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          All Invoices
        </Typography>
        {isOperations && selectedRows.length > 0 && (
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setAssignmentDialogOpen(true)}
          >
            Assign Selected ({selectedRows.length})
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search by Invoice # or Customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="NEW">New</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Team</InputLabel>
              <Select
                value={filters.team}
                label="Team"
                onChange={(e) => setFilters({ ...filters, team: e.target.value })}
              >
                <MenuItem value="all">All Teams</MenuItem>
                <MenuItem value="Team A">Team A</MenuItem>
                <MenuItem value="Team B">Team B</MenuItem>
                <MenuItem value="Team C">Team C</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={filters.assignedTo}
                label="Assigned To"
                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="unassigned">Unassigned</MenuItem>
                {mockUsers.map(user => (
                  <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Dispute Code</InputLabel>
              <Select
                value={filters.disputeCode}
                label="Dispute Code"
                onChange={(e) => setFilters({ ...filters, disputeCode: e.target.value })}
              >
                <MenuItem value="all">All Codes</MenuItem>
                <MenuItem value="PRICING">Pricing</MenuItem>
                <MenuItem value="SERVICE">Service</MenuItem>
                <MenuItem value="PAYMENT">Payment</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {isOperations && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                    checked={selectedRows.length > 0 && selectedRows.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'id'}
                  direction={orderBy === 'id' ? order : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  Invoice #
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'customerName'}
                  direction={orderBy === 'customerName' ? order : 'asc'}
                  onClick={() => handleSort('customerName')}
                >
                  Customer Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dueDate'}
                  direction={orderBy === 'dueDate' ? order : 'asc'}
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'ageInDays'}
                  direction={orderBy === 'ageInDays' ? order : 'asc'}
                  onClick={() => handleSort('ageInDays')}
                >
                  Age (Days)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'amountDue'}
                  direction={orderBy === 'amountDue' ? order : 'asc'}
                  onClick={() => handleSort('amountDue')}
                >
                  Amount Due
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Team</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Dispute</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                hover
                selected={selectedRows.indexOf(row.id) !== -1}
                onClick={() => navigate(`/invoices/${row.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                {isOperations && (
                  <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedRows.indexOf(row.id) !== -1}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                )}
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>
                  {new Date(row.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{row.ageInDays}</TableCell>
                <TableCell>
                  ${row.amountDue.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.team}</TableCell>
                <TableCell>
                  {row.assignedTo || (
                    <Chip
                      label="Unassigned"
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.disputeCode && (
                    <Chip
                      label={row.disputeCode}
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/invoices/${row.id}`);
                    }}
                  >
                    <NavigateNext />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Assignment Dialog - Only shown for Operations users */}
      {isOperations && (
        <Dialog open={assignmentDialogOpen} onClose={() => setAssignmentDialogOpen(false)}>
          <DialogTitle>Assign Invoices</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Team</InputLabel>
                <Select
                  value={selectedTeam}
                  label="Team"
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <MenuItem value="all">All Teams</MenuItem>
                  <MenuItem value="Team A">Team A</MenuItem>
                  <MenuItem value="Team B">Team B</MenuItem>
                  <MenuItem value="Team C">Team C</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={selectedUser}
                  label="Assign To"
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  {mockUsers
                    .filter(user => selectedTeam === 'all' || user.team === selectedTeam)
                    .map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.team} - {user.role})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignmentDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAssign}
              variant="contained"
              disabled={!selectedUser}
            >
              Assign
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default InvoiceList; 
