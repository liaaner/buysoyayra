'use client';

import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

type ProductPayload = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  size?: string;
};

interface StoreContextType {
  latestCartItem: ProductPayload | null;
  latestWishlistItem: ProductPayload | null;
  wishlistItems: ProductPayload[];
  addNotificationToCart: (product: ProductPayload) => void;
  addNotificationToWishlist: (product: ProductPayload) => void;
  removeFromWishlist: (productId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [latestCartItem, setLatestCartItem] = useState<ProductPayload | null>(null);
  const [latestWishlistItem, setLatestWishlistItem] = useState<ProductPayload | null>(null);
  const [wishlistItems, setWishlistItems] = useState<ProductPayload[]>([]);
  
  const cartTimer = useRef<NodeJS.Timeout | null>(null);
  const wishlistTimer = useRef<NodeJS.Timeout | null>(null);

  // Load wishlist from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('soyara_wishlist');
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save wishlist to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem('soyara_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addNotificationToCart = (product: ProductPayload) => {
    setLatestCartItem(product);
    if (cartTimer.current) clearTimeout(cartTimer.current);
    cartTimer.current = setTimeout(() => {
      setLatestCartItem(null);
    }, 4000);
  };

  const addNotificationToWishlist = (product: ProductPayload) => {
    setWishlistItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev;
      return [...prev, product];
    });

    setLatestWishlistItem(product);
    if (wishlistTimer.current) clearTimeout(wishlistTimer.current);
    wishlistTimer.current = setTimeout(() => {
      setLatestWishlistItem(null);
    }, 4000);
  };
  
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <StoreContext.Provider value={{ 
      latestCartItem, 
      latestWishlistItem, 
      wishlistItems,
      addNotificationToCart, 
      addNotificationToWishlist,
      removeFromWishlist
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
