import { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductAdmin from './ProductAdmin';
import UsersAdmin from './UsersAdmin';
import OrdersAdmin from './OrdersAdmin';

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState(0);

  const isAdmin = isAuthenticated && user?.role === 'admin';
  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 4 }}>
        Panel de Administración
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="admin tabs">
          <Tab label="Productos" />
          <Tab label="Usuarios" />
          <Tab label="Órdenes" />
        </Tabs>
      </Box>
      <Box hidden={tab !== 0}>
        <ProductAdmin />
      </Box>
      <Box hidden={tab !== 1}>
        <UsersAdmin />
      </Box>
      <Box hidden={tab !== 2}>
        <OrdersAdmin />
      </Box>
    </Container>
  );
};

export default AdminDashboard;