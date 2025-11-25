import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Añadir producto al carrito
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Quitar producto del carrito
  const removeFromCart = (productId) => {
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem.quantity === 1) {
      setCartItems(cartItems.filter(item => item.id !== productId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ));
    }
  };

  // Eliminar producto completamente del carrito
  const removeItemCompletely = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // Calcular total del carrito
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Obtener cantidad total de productos en el carrito
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    getCartTotal,
    getCartItemCount,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};