import { useState } from 'react';
import { Container, Paper, Typography, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api/xano';
import { useNavigate } from 'react-router-dom';
import { formatAxiosError } from '../../utils/http';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    if (!shipping.address || !shipping.city || !shipping.postalCode) {
      setSnackbar({ open: true, severity: 'error', message: 'Completa dirección, ciudad y código postal.' });
      return;
    }
    if (cartItems.length === 0) {
      setSnackbar({ open: true, severity: 'error', message: 'El carrito está vacío.' });
      return;
    }

    setLoading(true);
    try {
      const localOrder = {
        id: Date.now().toString(),
        ownerEmail: user.email,
        status: 'pendiente',
        total: getCartTotal(),
        items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        shipping,
        createdAt: new Date().toISOString()
      };

      try {
        // Intentar crear en Xano si el endpoint está disponible
        await createOrder({
          status: 'pendiente',
          total: localOrder.total,
          user_email: user.email,
          items: localOrder.items,
          shipping,
        });
      } catch (err) {
        console.warn('Fallo creando orden en Xano, guardando local:', err);
      }

      const saved = localStorage.getItem('orders');
      const current = saved ? JSON.parse(saved) : [];
      localStorage.setItem('orders', JSON.stringify([...current, localOrder]));

      clearCart();
      setSnackbar({ open: true, severity: 'success', message: 'Pedido realizado. Estado: pendiente.' });
      setTimeout(() => navigate('/pedidos'), 800);
    } catch (err) {
      setSnackbar({ open: true, severity: 'error', message: `Error al crear pedido: ${formatAxiosError(err)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Checkout</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Completa tus datos para simular el pago y crear tu pedido.
        </Typography>
        <form onSubmit={placeOrder}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="fullName" value={shipping.fullName} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" type="email" value={shipping.email} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Dirección" name="address" value={shipping.address} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ciudad" name="city" value={shipping.city} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Código Postal" name="postalCode" value={shipping.postalCode} onChange={handleChange} fullWidth required />
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 3 }}>Total: ${getCartTotal().toFixed(2)}</Typography>
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2, bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>
            {loading ? 'Procesando...' : 'Pagar y Crear Pedido'}
          </Button>
        </form>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Checkout;