import { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/xano';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para iniciar sesión
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Guardar en localStorage para mantener la sesión
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Eliminar datos de localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  // Actualizar datos del usuario (por ejemplo, nombre)
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  useEffect(() => {
    let lastEmail = '';
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      lastEmail = parsed?.email || '';
    }
    const token = localStorage.getItem('authToken');
    if (token) {
      authApi.get('/auth/me')
        .then((meResp) => {
          const d = meResp?.data || {};
          const name = d.name || d.full_name || d.username || d.email || 'Usuario';
          const email = (d.email || lastEmail || '').toLowerCase();
          const domainAdmin = email.endsWith('@studiobarber.cl');
          const role = domainAdmin ? 'admin' : (d.role || (d.is_admin ? 'admin' : 'client'));
          const u = { name, email, role };
          setUser(u);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        });
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
