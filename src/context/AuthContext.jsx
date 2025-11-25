import { createContext, useState, useContext } from 'react';

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
  };

  // Actualizar datos del usuario (por ejemplo, nombre)
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  // Verificar si hay un usuario guardado en localStorage al cargar
  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
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