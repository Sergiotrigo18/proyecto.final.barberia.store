import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { listOrders, updateOrder } from '../../api/xano';
import { formatAxiosError } from '../../utils/http';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [statusFilter, setStatusFilter] = useState('pending');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await listOrders();
      const arr = Array.isArray(resp.data) ? resp.data : (resp.data?.items || []);
      const normalized = arr.map(o => ({
        id: o.id,
        user_id: o.user_id ?? o.customer_id,
        total: Number(o.total ?? o.amount ?? 0),
        status: o.status || 'pending',
        created_at: o.created_at || o.created || '',
      }));
      const filtered = statusFilter ? normalized.filter(o => o.status === statusFilter) : normalized;
      setOrders(filtered);
    } catch (e) {
      setError(`No se pudo cargar órdenes. ${formatAxiosError(e)}. Verifica el endpoint en Xano.`);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const setOrderStatus = async (order, nextStatus) => {
    try {
      await updateOrder(order.id, { status: nextStatus });
      setOrders(prev => prev.map(o => (o.id === order.id ? { ...o, status: nextStatus } : o)).filter(o => !statusFilter || o.status === statusFilter));
      setSnackbar({ open: true, message: `Orden ${nextStatus}`, severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: `No se pudo actualizar. ${formatAxiosError(e)}`, severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Revisión de Órdenes</Typography>
      <FormControl sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel id="status-filter-label">Estado</InputLabel>
        <Select labelId="status-filter-label" value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)}>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="pending">Pendiente</MenuItem>
          <MenuItem value="sent">Enviado</MenuItem>
          <MenuItem value="rejected">Rechazado</MenuItem>
        </Select>
      </FormControl>
      <Paper>
        {loading ? (
          <Typography sx={{ p: 2 }}>Cargando órdenes…</Typography>
        ) : error ? (
          <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.user_id}</TableCell>
                  <TableCell>${o.total.toFixed(2)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell align="right">
                    {o.status === 'pending' && (
                      <>
                        <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => setOrderStatus(o, 'sent')}>Aceptar (Enviado)</Button>
                        <Button variant="contained" color="error" onClick={() => setOrderStatus(o, 'rejected')}>Rechazar</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrdersAdmin;