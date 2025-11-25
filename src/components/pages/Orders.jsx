import { useEffect, useState } from 'react';
import { Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { listOrders } from '../../api/xano';
import { formatAxiosError } from '../../utils/http';

const statusColor = (s) => {
  switch (s) {
    case 'pendiente': return 'warning';
    case 'enviado': return 'success';
    case 'rechazado': return 'error';
    default: return 'default';
  }
};

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await listOrders();
        const apiItems = Array.isArray(resp.data) ? resp.data : (resp.data?.items || []);
        const normalized = apiItems
          .filter(o => !user?.email || o.user_email === user.email)
          .map(o => ({ id: o.id, status: o.status || 'pendiente', total: Number(o.total || 0), createdAt: o.created_at || o.createdAt, items: o.items || [] }));
        if (normalized.length) {
          setOrders(normalized);
        } else {
          const saved = localStorage.getItem('orders');
          const local = saved ? JSON.parse(saved) : [];
          setOrders(local.filter(o => o.ownerEmail === user?.email));
        }
      } catch (e) {
        console.warn('Error listando órdenes desde Xano, usando local:', e);
        const saved = localStorage.getItem('orders');
        const local = saved ? JSON.parse(saved) : [];
        setOrders(local.filter(o => o.ownerEmail === user?.email));
        setError(formatAxiosError(e));
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) load();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Inicia sesión para ver tus pedidos</Typography>
          <Button variant="contained" href="/login" sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>Ir al Login</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Mis Pedidos</Typography>
      {error && (<Typography color="error" sx={{ mb: 2 }}>Aviso: {error}</Typography>)}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell><Chip label={o.status} color={statusColor(o.status)} /></TableCell>
                <TableCell>${Number(o.total).toFixed(2)}</TableCell>
                <TableCell>{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" sx={{ p: 2 }}>No tienes pedidos aún.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Orders;