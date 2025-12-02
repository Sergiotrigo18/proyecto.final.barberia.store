import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, Snackbar, Alert } from '@mui/material';
import { authApi } from '../../api/xano';
import { formatAxiosError } from '../../utils/http';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const IS_DEV = import.meta.env.DEV;
  const [canBlock, setCanBlock] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setInfo('');
    try {
      // 1) Intentar GET /user para listar usuarios
      try {
        const listResp = await authApi.get('/user');
        const items = Array.isArray(listResp.data) ? listResp.data : (listResp.data?.items || []);
        const normalized = items.map((u) => ({
          id: u.id,
          name: u.name || u.full_name || u.username || '',
          email: u.email || '',
          blocked: Boolean(u.blocked ?? u.is_blocked ?? false),
        }));
        if (normalized.length) {
          setUsers(normalized);
          setCanBlock(true);
          setInfo('Usuarios cargados desde Xano (/user).');
          return;
        }
      } catch (e) {
        console.warn('GET /user no disponible aún:', e);
      }

      // 2) Si /user no está, intentar /auth/me
      try {
        const meResp = await authApi.get('/auth/me');
        const d = meResp?.data || {};
        const me = {
          id: d.id,
          name: d.name || d.full_name || d.username || '',
          email: d.email || '',
          blocked: Boolean(d.blocked ?? d.is_blocked ?? false),
        };
        if (me.id) {
          setUsers([me]);
          setCanBlock(false);
          setInfo('Mostrando el usuario del token (/auth/me).');
          return;
        }
      } catch {}

      // 3) Fallback demo
      const demo = [
        { id: 1, name: 'Admin Demo', email: 'admin@demo.com', blocked: false },
        { id: 2, name: 'Cliente Demo', email: 'cliente@demo.com', blocked: false },
      ];
      if (IS_DEV) {
        setUsers(demo);
        setCanBlock(false);
        setInfo('Modo demo activo: usando lista simulada.');
        return;
      }

      // 4) Producción sin endpoints
      setUsers(demo);
      setCanBlock(false);
      setInfo('Sin endpoints disponibles para listar usuarios. Mostrando datos demo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleBlock = async (user) => {
    const next = !user.blocked;
    // En desarrollo, no llamamos API: solo simulamos el cambio
    if (IS_DEV || !canBlock) {
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, blocked: next } : u)));
      setSnackbar({ open: true, message: canBlock ? (next ? 'Usuario bloqueado (demo)' : 'Usuario desbloqueado (demo)') : 'Bloqueo no disponible en este modo', severity: canBlock ? 'success' : 'info' });
      return;
    }
    try {
      await authApi.patch(`/user/${user.id}`, { blocked: next });
      setUsers(prev => prev.map(u => (u.id === user.id ? { ...u, blocked: next } : u)));
      setSnackbar({ open: true, message: next ? 'Usuario bloqueado' : 'Usuario desbloqueado', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: `No se pudo actualizar. ${formatAxiosError(e)}`, severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Gestión de Usuarios</Typography>
      <Paper>
        {loading ? (
          <Typography sx={{ p: 2 }}>Cargando usuarios…</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.blocked ? 'Bloqueado' : 'Activo'}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color={u.blocked ? 'success' : 'error'} disabled={!canBlock} onClick={() => toggleBlock(u)}>
                      {u.blocked ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {info && (
          <Alert severity="info" sx={{ m: 2 }}>{info}</Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        )}
      </Paper>
      <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UsersAdmin;
