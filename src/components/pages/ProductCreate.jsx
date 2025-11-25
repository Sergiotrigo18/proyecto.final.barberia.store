import { useState } from 'react';
import { 
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import { createProduct } from '../../api/xano';
import { formatAxiosError } from '../../utils/http';
import { useAuth } from '../../context/AuthContext';

const ProductCreate = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    description: '',
    image_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        image_url: form.image_url
      };
      await createProduct(payload);
      setSnackbar({ open: true, message: 'Producto creado correctamente', severity: 'success' });
      setForm({ name: '', brand: '', category: '', price: '', description: '', image_url: '' });
    } catch (err) {
      setSnackbar({ open: true, message: `No se pudo crear. ${formatAxiosError(err)}`, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Crear Producto
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Marca" name="brand" value={form.brand} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select name="category" label="Categoría" value={form.category} onChange={handleChange}>
                  <MenuItem value="">Sin categoría</MenuItem>
                  <MenuItem value="Cabello">Cabello</MenuItem>
                  <MenuItem value="Barba">Barba</MenuItem>
                  <MenuItem value="Bigote">Bigote</MenuItem>
                  <MenuItem value="Otros">Otros</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Precio" name="price" type="number" value={form.price} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Descripción" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="URL de imagen" name="image_url" value={form.image_url} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button type="button" variant="outlined" href="/productos" disabled={saving}>Ver catálogo</Button>
                <Button type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>
                  {saving ? 'Guardando…' : 'Crear Producto'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductCreate;