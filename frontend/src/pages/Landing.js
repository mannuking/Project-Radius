import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
} from '@mui/material';
import {
  SupervisorAccount as DirectorIcon,
  Assignment as OperationsIcon,
  AccountBalance as BillerIcon,
  ContactPhone as CollectorIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const roleCards = [
  {
    title: 'Director',
    description: 'Access high-level analytics, trends, and performance metrics.',
    icon: DirectorIcon,
    role: 'director',
    color: '#1976d2', // blue
  },
  {
    title: 'Operations',
    description: 'Manage assignments, monitor team performance, and handle disputes.',
    icon: OperationsIcon,
    role: 'operations',
    color: '#2e7d32', // green
  },
  {
    title: 'Biller',
    description: 'Process invoices, handle billing inquiries, and manage customer accounts.',
    icon: BillerIcon,
    role: 'biller',
    color: '#ed6c02', // orange
  },
  {
    title: 'Collector',
    description: 'Manage collections, handle customer communications, and resolve disputes.',
    icon: CollectorIcon,
    role: 'collector',
    color: '#9c27b0', // purple
  },
];

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, updateUserRole } = useAuth();

  const handleRoleSelect = async (role) => {
    try {
      await updateUserRole(role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating user role:', error);
      // You might want to show an error message to the user
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Welcome to Project Radius
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Select your role to continue
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {roleCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={card.role}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: card.color,
                    py: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: 48, color: 'white' }} />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleRoleSelect(card.role)}
                    sx={{
                      bgcolor: card.color,
                      '&:hover': {
                        bgcolor: theme.palette.augmentColor({
                          color: { main: card.color },
                        }).dark,
                      },
                    }}
                  >
                    Continue as {card.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )}
        )}
      </Grid>
    </Container>
  );
};

export default Landing; 
