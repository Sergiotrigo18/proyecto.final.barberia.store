import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely, 
    getCartTotal, 
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Tu carrito está vacío
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Agrega productos de nuestra tienda para continuar
          </Typography>
          <Button 
            variant="contained" 
            href="/"
            sx={{ 
              backgroundColor: '#d4af37', 
              '&:hover': { backgroundColor: '#b8971f' }
            }}
          >
            Volver a la tienda
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Carrito de Compras
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {cartItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box
                      component="img"
                      sx={{
                        height: 100,
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                      src={item.image}
                      alt={item.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => removeFromCart(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ mx: 2 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => addToCart(item)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton 
                        color="error" 
                        onClick={() => removeItemCompletely(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={clearCart}
            >
              Vaciar Carrito
            </Button>
            <Button 
              variant="outlined" 
              href="/"
            >
              Seguir Comprando
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>${getCartTotal().toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Envío</Typography>
              <Typography>Gratis</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${getCartTotal().toFixed(2)}</Typography>
            </Box>
            
            <Button 
              variant="contained" 
              fullWidth
              onClick={() => navigate('/checkout')}
              sx={{ 
                backgroundColor: '#d4af37', 
                '&:hover': { backgroundColor: '#b8971f' }
              }}
            >
              Proceder al Pago
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;