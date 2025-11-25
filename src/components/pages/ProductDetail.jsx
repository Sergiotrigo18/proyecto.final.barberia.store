import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Grid, Box, Typography, Paper, Button, Chip, ImageList, ImageListItem, TextField, Breadcrumbs, Link, Divider, List, ListItem, ListItemText } from '@mui/material';
import { getProduct, getImageUrl, getImageList } from '../../api/xano';
import { useCart } from '../../context/CartContext';
import { formatAxiosError } from '../../utils/http';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getProduct(id);
      const p = resp?.data || {};
      const rawImage = p.image_url ?? p.image ?? (Array.isArray(p.images) ? p.images[0] : undefined);
      const resolvedImage = getImageUrl(rawImage);
      console.log('[ProductDetail] raw', { id, rawImage, resolvedImage, images: p.images, product: p });
      const normalized = {
        id: p.id ?? id,
        name: p.name,
        brand: p.brand || '',
        category: p.category || '',
        price: Number(p.price ?? 0),
        description: p.description || '',
        imageUrl: resolvedImage,
        images: getImageList(p.images, p.image, p.image_url),
      };
      console.log('[ProductDetail] normalized', normalized);
      setProduct(normalized);
      setActiveImageIndex(0);
    } catch (e) {
      console.warn('Fallo al cargar producto desde Xano, usando localStorage:', e);
      // Fallback: buscar en localStorage
      const saved = localStorage.getItem('products');
      const list = saved ? JSON.parse(saved) : [];
      const found = list.find((p) => String(p.id) === String(id));
      if (found) {
        console.log('[ProductDetail] localStorage item', found);
        setProduct({
          id: found.id,
          name: found.name,
          brand: found.brand || '',
          category: found.category || '',
          price: Number(found.price ?? 0),
          description: found.description || '',
          imageUrl: getImageUrl(found.imageUrl || (Array.isArray(found.images) ? found.images[0] : undefined)),
          images: getImageList(found.images, found.imageUrl),
        });
        setActiveImageIndex(0);
      } else {
        setError(`No se pudo cargar el producto. ${formatAxiosError(e)}.`);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      image: product.imageUrl,
      brand: product.brand,
      category: product.category,
      quantity: Number(quantity)
    });
  };

  const buyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Cargando producto…</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} underline="hover" color="inherit" to="/">Inicio</Link>
        <Link component={RouterLink} underline="hover" color="inherit" to="/productos">Productos</Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
        {product.name}
      </Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {product.brand && <Chip label={`Marca: ${product.brand}`} sx={{ bgcolor: '#fff8e1' }} />} 
        {product.category && <Chip label={`Categoría: ${product.category}`} sx={{ bgcolor: '#fff8e1' }} />} 
      </Box>
      <Grid container spacing={3}>
        {/* Galería */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src={product.images?.[activeImageIndex]?.url || product.imageUrl} 
                alt={product.name} 
                style={{ maxWidth: 360, maxHeight: 360, width: '100%', height: 'auto', borderRadius: 10 }} 
              />
            </Box>
            {product.images?.length > 1 && (
              <ImageList cols={5} rowHeight={72} gap={8} sx={{ mt: 2 }}>
                {product.images.map((img, idx) => (
                  <ImageListItem key={idx} onClick={() => setActiveImageIndex(idx)} style={{ cursor: 'pointer' }}>
                    <img src={img.url} alt={`${product.name}-${idx}`} style={{ width: '100%', height: 72, objectFit: 'cover', borderRadius: 6, border: idx === activeImageIndex ? '2px solid #d4af37' : '1px solid #eee' }} />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Paper>
        </Grid>

        {/* Información y acciones */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 1, color: '#1a1a1a' }}>
              ${Number(product.price).toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{product.description || 'Sin descripción'}</Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Detalles</Typography>
            <List dense>
              {product.brand && (
                <ListItem>
                  <ListItemText primary="Marca" secondary={product.brand} />
                </ListItem>
              )}
              {product.category && (
                <ListItem>
                  <ListItemText primary="Categoría" secondary={product.category} />
                </ListItem>
              )}
            </List>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
              <TextField
                label="Cantidad"
                type="number"
                inputProps={{ min: 1 }}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                sx={{ width: 120 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleAddToCart} sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>
                Añadir al Carrito
              </Button>
              <Button variant="outlined" onClick={buyNow}>Comprar Ahora</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;