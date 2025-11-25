import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { createProduct, updateProduct, uploadImages, getProducts, deleteProduct } from '../../api/xano';
import InputAdornment from '@mui/material/InputAdornment';
import { formatAxiosError } from '../../utils/http';

const ProductAdmin = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    imageFiles: [],
    brand: '',
    category: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setSnackbarMessage('Por favor completa los campos obligatorios');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      let imageUrl = formData.imageUrl;
      let images = [];
      if (Array.isArray(formData.imageFiles) && formData.imageFiles.length > 0) {
        const res = await uploadImages(formData.imageFiles);
        const uploaded = Array.isArray(res) ? res : [];
        images = uploaded
          .map(x => x?.url || x?.path)
          .filter(Boolean)
          .map(u => ({ url: u }));
        imageUrl = images[0]?.url || imageUrl;
      }

      if (isEditing) {
        const updatedLocal = products.map(p => (
          p.id === formData.id ? { ...formData, imageUrl, images } : p
        ));
        setProducts(updatedLocal);
        localStorage.setItem('products', JSON.stringify(updatedLocal));

        const existing = products.find(p => p.id === formData.id);
        const xanoId = existing?.xanoId || (typeof existing?.id === 'number' ? existing.id : null);
        if (xanoId) {
          await updateProduct(xanoId, {
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            brand: formData.brand,
            category: formData.category,
            image_url: imageUrl
          });
        }

        setSnackbarMessage('Producto actualizado correctamente');
      } else {
        const baseLocal = { ...formData, imageUrl, images, id: Date.now().toString() };
        let createdId = null;
        try {
          const created = await createProduct({
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            brand: formData.brand,
            category: formData.category,
            image_url: imageUrl
          });
          createdId = created?.data?.id;
        } catch (_) {
          // si falla la creación en Xano, seguimos con local
        }
        const newProduct = createdId ? { ...baseLocal, id: createdId, xanoId: createdId } : baseLocal;
        const updatedLocal = [...products, newProduct];
        setProducts(updatedLocal);
        localStorage.setItem('products', JSON.stringify(updatedLocal));
        setSnackbarMessage('Producto creado correctamente');
      }

      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setFormData({ id: '', name: '', price: '', description: '', imageUrl: '', imageFiles: [], brand: '', category: '' });
      setIsEditing(false);
      await loadProducts();
    } catch (err) {
      console.error('Error guardando producto:', err);
      setSnackbarMessage('Error guardando producto');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteId) {
        await deleteProduct(deleteId);
      }
      const filteredProducts = products.filter(product => product.id !== deleteId);
      setProducts(filteredProducts);
      setOpenDialog(false);
      setSnackbarMessage('Producto eliminado correctamente');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      await loadProducts();
    } catch (err) {
      console.error('Error eliminando producto:', err);
      setOpenDialog(false);
      setSnackbarMessage(`Error eliminando producto en Xano: ${formatAxiosError(err)}`);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  // Usa el helper centralizado desde utils/http
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getProducts();
      const apiItems = Array.isArray(resp.data) ? resp.data : (resp.data?.items || []);
      const normalized = apiItems.map(p => ({
        id: p.id ?? p.product_id ?? `${p.name}-${p.price}`,
        name: p.name,
        brand: p.brand || '',
        category: p.category || '',
        price: Number(p.price),
        description: p.description || '',
        imageUrl: p.image_url || p.image || (Array.isArray(p.images) ? (p.images[0]?.url || p.images[0]?.path) : undefined)
      }));
      setProducts(normalized);
    } catch (e) {
      console.error('Xano getProducts error:', e);
      // Fallback: intentar cargar desde localStorage para no dejar vacío
      const saved = localStorage.getItem('products');
      const local = saved ? JSON.parse(saved) : [];
      setProducts(local);
      setError(`No se pudo cargar desde Xano. ${formatAxiosError(e)}. Verifica el endpoint y CORS.`);
    } finally {
       setLoading(false);
     }
   }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 4 }}>
        Administración de Productos
      </Typography>
      <TextField
        fullWidth
        label="Buscar por nombre, marca o categoría"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={4}>
        {/* Formulario */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
              {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nombre del Producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Marca"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Categoría"
                name="category"
                value={formData.category}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
              />
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="URL de Imagen"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                margin="normal"
              />
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Imágenes"
                  type="file"
                  inputProps={{ accept: 'image/*', multiple: true }}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageFiles: Array.from(e.target.files || []) }))}
                  fullWidth
                />
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>
                  {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
                </Button>
                {isEditing && (
                  <Button 
                    variant="outlined" 
                    onClick={() => { 
                      setFormData({ id: '', name: '', price: '', description: '', imageUrl: '', brand: '', category: '' }); 
                      setIsEditing(false);
                    }}
                  >
                    Cancelar Edición
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Lista de Productos */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
              Productos Existentes
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
              <Button variant="outlined" onClick={loadProducts}>Refrescar</Button>
            </Box>
            {loading && (<Typography>Cargando productos...</Typography>)}
            {error && (<Typography color="error">{error}</Typography>)}
            {products.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Marca</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
      <TableBody>
                  {products
                    .filter(p => {
                      const q = search.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        (p.name || '').toLowerCase().includes(q) ||
                        (p.brand || '').toLowerCase().includes(q) ||
                        (p.category || '').toLowerCase().includes(q)
                      );
                    })
                    .map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brand || '-'}</TableCell>
                        <TableCell>{product.category || '-'}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{(product.description || '').substring(0, 50)}...</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(product)} aria-label="Editar">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteClick(product.id)} aria-label="Eliminar" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No hay productos aún. Crea uno desde el formulario.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDialog(false)} 
            sx={{ color: '#d4af37' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductAdmin;