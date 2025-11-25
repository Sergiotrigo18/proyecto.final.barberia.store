import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Container,
  Paper
} from '@mui/material';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

// Productos de ejemplo para la barbería
const products = [
  {
    id: 1,
    name: 'Pomada Fijadora',
    description: 'Pomada de fijación fuerte para estilos definidos',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1581071292364-6772580cb271?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    name: 'Aceite para Barba',
    description: 'Aceite hidratante para barba con aroma a sándalo',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1564199844242-cf4bbc1e4076?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    name: 'Cera para Bigote',
    description: 'Cera moldeadora para bigote con fijación natural',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 4,
    name: 'Kit de Afeitado',
    description: 'Kit completo de afeitado tradicional con navaja',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  }
];

const Home = () => {
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          height: '70vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',
          p: 4
        }}
      >
        {/* Mensaje de bienvenida personalizado */}
        {isAuthenticated && (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 4, 
              bgcolor: 'rgba(212, 175, 55, 0.9)', 
              color: 'black',
              borderRadius: 2,
              maxWidth: '80%'
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              ¡Bienvenido a Studio Barber, {user?.name}!
            </Typography>
            <Typography variant="body1">
              Nos alegra verte de nuevo. ¿Listo para un nuevo estilo?
            </Typography>
          </Paper>
        )}
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Studio Barber
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, maxWidth: '800px' }}>
          Expertos en cortes clásicos y modernos para el hombre de hoy
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          component="a"
          href="/citas"
          sx={{ 
            bgcolor: '#d4af37', 
            color: 'black', 
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#b8860b' }
          }}
        >
          Agenda tu cita
        </Button>
      </Box>

      {/* Servicios */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Nuestros Servicios
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Corte de Cabello"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Corte de Cabello
                </Typography>
                <Typography>
                  Cortes modernos y clásicos adaptados a tu estilo personal.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Afeitado Tradicional"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Afeitado Tradicional
                </Typography>
                <Typography>
                  Afeitado con navaja y toalla caliente para una experiencia clásica.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1517832606299-7ae9b720a186?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Arreglo de Barba"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Arreglo de Barba
                </Typography>
                <Typography>
                  Perfilado y mantenimiento de barba para un look impecable.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image="/src/assets/images/tratamiento-capilar.svg"
                alt="Tratamiento Capilar"
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h3">
                  Tratamiento Capilar
                </Typography>
                <Typography>
                  Tratamientos para fortalecer y revitalizar tu cabello.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Productos */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Productos Destacados
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {product.name}
                  </Typography>
                  <Typography gutterBottom>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => addToCart(product)}
                    sx={{ 
                      backgroundColor: '#d4af37', 
                      '&:hover': { backgroundColor: '#b8971f' }
                    }}
                  >
                    Añadir al Carrito
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;