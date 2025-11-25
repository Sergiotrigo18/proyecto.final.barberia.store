import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Badge,
  Link,
  Avatar,
  Tooltip,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Menú dinámico basado en autenticación
  const menuItems = [
    { text: 'Inicio', path: '/' },
    { text: 'Productos', path: '/catalogo' },
    { text: 'Nosotros', path: '/nosotros' },
    { text: 'Contacto', path: '/contacto' },
    // Ocultar "Agendar Cita" en vista admin o si el usuario es admin
    ...((isAdminView || (isAuthenticated && user?.role === 'admin')) ? [] : [{ text: 'Agendar Cita', path: '/citas' }]),
    // "Citas Agendadas" sólo para clientes y fuera de vista admin
    ...((isAuthenticated && user?.role !== 'admin' && !isAdminView) ? [{ text: 'Citas Agendadas', path: '/citas-agendadas' }] : []),
    // Enlaces cliente cuando está autenticado
    ...(isAuthenticated ? [{ text: 'Mis Pedidos', path: '/pedidos' }, { text: 'Perfil', path: '/perfil' }] : []),
    // Vista Admin solo para rol admin
    ...(isAuthenticated && user?.role === 'admin' ? [{ text: 'Admin', path: '/admin' }] : []),
    // No mostrar "Crear Producto" en el banner para clientes ni admin; se gestiona dentro de /admin
    ...(isAuthenticated ? [] : [{ text: 'Iniciar Sesión', path: '/login' }])
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a' }}>
      <Toolbar sx={{ flexWrap: 'wrap', gap: 0.5 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold', 
            textDecoration: 'none', 
            color: 'white',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Studio Barber
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.text} 
                  component={RouterLink} 
                  to={item.path}
                  onClick={handleClose}
                >
                  {item.text}
                </MenuItem>
              ))}
              {isAuthenticated && (
                <MenuItem
                  onClick={() => {
                    logout();
                    handleClose();
                    navigate('/');
                  }}
                >
                  Cerrar Sesión
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {menuItems.map((item) => (
              <Button 
                key={item.text}
                component={RouterLink}
                to={item.path}
                color="inherit"
                sx={{ mx: 0.5, px: 1, minWidth: 0, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
              >
                {item.text}
              </Button>
            ))}
            {isAuthenticated && (
              <Button
                color="inherit"
                sx={{ mx: 0.5, px: 1, minWidth: 0, fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                onClick={() => { logout(); navigate('/'); }}
              >
                Cerrar Sesión
              </Button>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Mostrar nombre de usuario o botón de login */}
          {isAuthenticated ? (
            <Chip
              avatar={<Avatar sx={{ bgcolor: '#d4af37' }}>{user?.name?.charAt(0).toUpperCase()}</Avatar>}
              label={`Bienvenido, ${user?.name}`}
              variant="outlined"
              sx={{ 
                ml: 1, 
                color: 'white', 
                borderColor: '#d4af37',
                fontSize: { xs: '0.7rem', md: '0.8rem' },
                '& .MuiChip-avatar': { color: 'black', fontWeight: 'bold' },
                display: { xs: 'none', md: 'inline-flex' }
              }}
            />
          ) : null}
          
          <IconButton 
            color="inherit" 
            component={RouterLink} 
            to="/carrito"
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={getCartItemCount()} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;