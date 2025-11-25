import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Paper,
  Grid,
  Link
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../utils/demoUsers';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'client'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const target = formData.role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.client;

    // Validar correo y contraseña según rol seleccionado
    const emailOk = formData.email.trim().toLowerCase() === target.email;
    const passOk = formData.password === target.password;
    if (!emailOk || !passOk) {
      setError('Correo o contraseña inválidos para el rol seleccionado.');
      return;
    }

    // Autenticación aceptada: usar datos del usuario demo
    login({
      name: target.name,
      email: target.email,
      role: target.role
    });
    
    // Redirigir inmediatamente: si venías de una ruta protegida, vuelve allí; si no, a inicio
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {!isLogin && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Rol</InputLabel>
                <Select
                  labelId="role-select-label"
                  label="Rol"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="client">Cliente</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              bgcolor: '#d4af37', 
              '&:hover': { bgcolor: '#b8860b' },
              color: 'black',
              fontWeight: 'bold'
            }}
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
        <Grid container justifyContent="center">
          <Grid item>
            <Link 
              component="button" 
              variant="body2" 
              onClick={toggleMode}
              sx={{ color: '#d4af37' }}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Link>
          </Grid>
        </Grid>
        {/* Cuentas de prueba ocultas: siguen activas para validación, pero no se muestran en UI */}
      </Box>
    </Paper>
  </Container>
  );
};

export default Login;