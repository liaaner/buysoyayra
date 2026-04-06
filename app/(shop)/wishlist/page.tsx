'use client';

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/contexts/StoreContext";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { addToCart } from '@/app/(shop)/cart/actions';
import { useState } from "react";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addNotificationToCart } = useStore();
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const handleAddToCart = async (product: any) => {
    setAddingToCartId(product.id);
    await addToCart(product.id, 1);
    setAddingToCartId(null);
    removeFromWishlist(product.id);
    addNotificationToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Looks like you haven't added anything to your wishlist yet. Explore our collections and find something you love.
        </p>
        <Link 
          href="/" 
          className="bg-[#ff3f6c] text-white px-8 py-3 rounded-full font-bold hover:bg-[#ff3f6c]/90 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black tracking-tighter mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8 font-medium">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-muted w-full overflow-hidden">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Heart className="w-8 h-8 text-muted-foreground/30" />
                </div>
              )}
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  removeFromWishlist(item.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white transition-colors z-10"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-sm leading-tight text-foreground line-clamp-2 mb-2">
                {item.name}
              </h3>
              <div className="mt-auto pt-2 flex items-end justify-between">
                <span className="font-extrabold text-lg">${item.price.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => handleAddToCart(item)}
                disabled={addingToCartId === item.id}
                className="mt-4 w-full bg-foreground text-background py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                {addingToCartId === item.id ? 'Loading...' : 'Move to Bag'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
