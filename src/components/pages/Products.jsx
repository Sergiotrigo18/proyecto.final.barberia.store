import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import { getProducts, absoluteFileUrl, getImageUrl } from '../../api/xano';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import { formatAxiosError } from '../../utils/http';

// Fallback demo products if localStorage has no products yet
const demoProducts = [
  { id: 'd1', name: 'Pomada Mate', brand: 'Reuzel', category: 'Cabello', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1581071292364-6772580cb271?auto=format&fit=crop&w=500&q=80', description: 'Fijación media, acabado mate.' },
  { id: 'd2', name: 'Aceite de Barba Sándalo', brand: 'Proraso', category: 'Barba', price: 12.5, imageUrl: 'https://images.unsplash.com/photo-1564199844242-cf4bbc1e4076?auto=format&fit=crop&w=500&q=80', description: 'Suaviza y perfuma tu barba.' },
  { id: 'd3', name: 'Cera Bigote Natural', brand: 'Captain Fawcett', category: 'Bigote', price: 9.99, imageUrl: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=500&q=80', description: 'Moldeado flexible y natural.' },
  { id: 'd4', name: 'Shampoo Anticaspa', brand: 'American Crew', category: 'Cabello', price: 11.25, imageUrl: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=500&q=80', description: 'Limpieza profunda y fresca.' },
];

const Products = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getProducts();
      console.log(resp.data);
      const apiItems = Array.isArray(resp.data) ? resp.data : (resp.data?.items || []);
      const normalized = apiItems.map(p => {
        const rawImage = p.image_url ?? p.image ?? (Array.isArray(p.images) ? p.images[0] : undefined);
        const resolvedImage = getImageUrl(rawImage);
        console.log('[Products] item', {
          id: p.id ?? p.product_id,
          name: p.name,
          rawImage,
          resolvedImage,
          images: p.images
        });
        return {
          id: p.id ?? p.product_id ?? `${p.name}-${p.price}`,
          name: p.name,
          brand: p.brand || '',
          category: p.category || '',
          price: Number(p.price),
          description: p.description || '',
          imageUrl: resolvedImage,
        };
      });
      setProducts(normalized);
    } catch (e) {
      console.error('Error cargando productos del catálogo:', e);
      const saved = localStorage.getItem('products');
      const local = saved ? JSON.parse(saved) : [];
      const fallback = local.length ? local : demoProducts;
      setProducts(fallback);
      setError(`No se pudo cargar desde Xano. ${formatAxiosError(e)}. Verifica el endpoint y CORS.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const byBrand = brand ? p.brand === brand : true;
      const byCategory = category ? p.category === category : true;
      const byMin = minPrice !== '' ? Number(p.price) >= Number(minPrice) : true;
      const byMax = maxPrice !== '' ? Number(p.price) <= Number(maxPrice) : true;
      return byBrand && byCategory && byMin && byMax;
    });
  }, [products, brand, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setBrand('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Productos
      </Typography>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Marca</InputLabel>
              <Select value={brand} label="Marca" onChange={(e) => setBrand(e.target.value)}>
                <MenuItem value="">Todas</MenuItem>
                {brands.map(b => (
                  <MenuItem key={b} value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select value={category} label="Categoría" onChange={(e) => setCategory(e.target.value)}>
                <MenuItem value="">Todas</MenuItem>
                {categories.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField label="Precio mínimo" type="number" fullWidth value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <TextField label="Precio máximo" type="number" fullWidth value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={clearFilters}>Limpiar filtros</Button>
              <Button variant="contained" onClick={load} sx={{ bgcolor: '#d4af37', color: 'black', '&:hover': { bgcolor: '#b8971f' } }}>Refrescar</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Listado */}
      <Grid container spacing={3}>
        {filtered.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component={RouterLink} to={`/productos/${product.id}`} sx={{ height: 160 }}>
                <img src={product.imageUrl} alt={product.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  <Link component={RouterLink} to={`/productos/${product.id}`} underline="hover" color="inherit">
                    {product.name}
                  </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Marca: {product.brand} · Categoría: {product.category}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">${Number(product.price).toFixed(2)}</Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    description: product.description,
                    image: product.imageUrl,
                    brand: product.brand,
                    category: product.category
                  })}
                  sx={{ backgroundColor: '#d4af37', '&:hover': { backgroundColor: '#b8971f' } }}
                >
                  Añadir al Carrito
                </Button>
                <Button size="small" component={RouterLink} to={`/productos/${product.id}`}>
                  Ver detalle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>No hay productos con los filtros seleccionados.</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Products;