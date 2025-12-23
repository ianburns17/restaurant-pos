import React, { useState } from 'react';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type Screen = 'menu' | 'cart';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      
      return [...prevItems, item];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigateToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleNavigateToCart = () => {
    setCurrentScreen('cart');
  };

  return (
    <div className="app">
      {currentScreen === 'menu' ? (
        <MenuScreen
          onAddToCart={handleAddToCart}
          onNavigateToCart={handleNavigateToCart}
          cartItemCount={cartItems.length}
        />
      ) : (
        <CartScreen
          cartItems={cartItems}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          onNavigateToMenu={handleNavigateToMenu}
        />
      )}
    </div>
  );
};

export default App;
