import { useState, useEffect } from 'react';
import { Container, Paper, Typography, Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const saved = localStorage.getItem(`profile:${user?.email}`);
    if (saved) {
      const p = JSON.parse(saved);
      setForm({ name: p.name || user?.name || '', phone: p.phone || '', address: p.address || '' });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    const profile = { ...form };
    localStorage.setItem(`profile:${user.email}`, JSON.stringify(profile));
    // Reflejar cambio de nombre en Navbar y contexto
    updateUser({ ...user, name: form.name });
    setSnackbar({ open: true, message: 'Perfil actualizado', severity: 'success' });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Inicia sesión para editar tu perfil</Typography>
          <Button variant="contained" href="/login" sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>Ir al Login</Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Mi Perfil</Typography>
        <form onSubmit={save}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Teléfono" name="phone" value={form.phone} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Dirección" name="address" value={form.address} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ mt: 2, bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>Guardar Cambios</Button>
        </form>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Profile;