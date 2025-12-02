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
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/xano';
import { formatAxiosError } from '../../utils/http';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const now = Date.now();
    const last = Number(localStorage.getItem('lastAuthAttempt') || 0);
    if (now - last < 2500) {
      setError('Demasiadas solicitudes. Intenta en unos segundos.');
      return;
    }
    localStorage.setItem('lastAuthAttempt', String(now));
    setSubmitting(true);
    try {
      if (isLogin) {
        const resp = await authApi.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        const token = resp?.data?.token || resp?.data?.authToken || resp?.data;
        if (!token) {
          throw new Error('Token no recibido desde Xano');
        }
        localStorage.setItem('authToken', token);
        const meResp = await authApi.get('/auth/me');
        const d = meResp?.data || {};
        const name = d.name || d.full_name || d.username || d.email || 'Usuario';
        const email = (d.email || formData.email || '').toLowerCase();
        const domainAdmin = email.endsWith('@studiobarber.cl');
        const role = domainAdmin ? 'admin' : (d.role || (d.is_admin ? 'admin' : 'client'));
        login({ name, email, role });
        const from = role === 'admin' ? '/admin' : (location.state?.from || '/');
        navigate(from, { replace: true });
        return;
      }

      const emailNorm = formData.email.trim().toLowerCase();
      const allowed = emailNorm.endsWith('@gmail.com') || emailNorm.endsWith('@duocuc.cl') || emailNorm.endsWith('@studiobarber.cl');
      if (!allowed) {
        setError('El correo debe ser @gmail.com o @duocuc.cl');
        return;
      }
      await authApi.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      const loginResp = await authApi.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      const token = loginResp?.data?.token || loginResp?.data?.authToken || loginResp?.data;
      if (token) localStorage.setItem('authToken', token);
      const meResp = await authApi.get('/auth/me');
      const d = meResp?.data || {};
      const name = d.name || d.full_name || d.username || d.email || formData.name || 'Usuario';
      const email = (d.email || formData.email || '').toLowerCase();
      const domainAdmin = email.endsWith('@studiobarber.cl');
      const role = domainAdmin ? 'admin' : (d.role || (d.is_admin ? 'admin' : 'client'));
      login({ name, email, role });
      const from = role === 'admin' ? '/admin' : (location.state?.from || '/');
      navigate(from, { replace: true });
    } catch (err) {
      setError(`No se pudo procesar. ${formatAxiosError(err)}`);
    } finally {
      setSubmitting(false);
    }
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
            disabled={submitting}
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
