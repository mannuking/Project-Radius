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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  NavigateNext,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data - Replace with actual API calls
const mockData = Array.from({ length: 50 }, (_, index) => ({
  id: `INV-2024-${(index + 1).toString().padStart(4, '0')}`,
  customerName: `Customer ${index + 1}`,
  dueDate: new Date(2024, 0, index + 1).toISOString(),
  ageInDays: Math.floor(Math.random() * 120),
  amountDue: Math.floor(Math.random() * 10000),
  status: ['L1', 'L2', 'L3'][Math.floor(Math.random() * 3)],
  disputeCode: Math.random() > 0.7 ? 'PRICING' : null,
  lastCommentDate: new Date(2024, 1, index + 1).toISOString(),
  ptpDate: Math.random() > 0.5 ? new Date(2024, 2, index + 1).toISOString() : null,
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'L1':
      return 'error';
    case 'L2':
      return 'warning';
    case 'L3':
      return 'info';
    default:
      return 'default';
  }
};

const Worklist = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isCollector = currentUser?.role === 'collector';

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('dueDate');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredData = mockData
    .filter((row) => {
      const matchesSearch = (
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const isAsc = order === 'asc';
      if (orderBy === 'amountDue') {
        return isAsc ? a.amountDue - b.amountDue : b.amountDue - a.amountDue;
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
      <Typography variant="h4" gutterBottom>
        My Worklist
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Search by Invoice # or Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="L1">L1</MenuItem>
            <MenuItem value="L2">L2</MenuItem>
            <MenuItem value="L3">L3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
              <TableCell>Dispute</TableCell>
              <TableCell>Last Comment</TableCell>
              {isCollector && <TableCell>PTP Date</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id} hover>
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
                <TableCell>
                  {row.disputeCode && (
                    <Chip
                      label={row.disputeCode}
                      color="warning"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {new Date(row.lastCommentDate).toLocaleDateString()}
                </TableCell>
                {isCollector && (
                  <TableCell>
                    {row.ptpDate && new Date(row.ptpDate).toLocaleDateString()}
                  </TableCell>
                )}
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/invoices/${row.id}`)}
                    >
                      <NavigateNext />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default Worklist; 
