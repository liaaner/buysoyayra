'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/contexts/StoreContext';
import { ShoppingBag, ChevronRight, Zap, Star, Heart, CheckCircle2, MapPin, Truck, Banknote, RefreshCcw, ShieldCheck } from 'lucide-react';
import { addToCart } from '@/app/(shop)/cart/actions';

export default function ProductActions({ product, avgRating = 0, totalReviews = 0 }: { product: any, avgRating?: number, totalReviews?: number }) {
  const router = useRouter();
  const { addNotificationToCart, addNotificationToWishlist, wishlistItems, removeFromWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [showPincodeWarning, setShowPincodeWarning] = useState(false);

  const isRestricted = product.min_pincode !== null || product.max_pincode !== null;
  const canAddToCart = isRestricted ? pincodeStatus === 'valid' : pincodeStatus !== 'invalid';

  // Sync initial wishlist state, safely handled after mount to avoid hydration mismatch
  useEffect(() => {
    setIsWishlisted(wishlistItems.some(item => item.id === product.id));
  }, [wishlistItems, product.id]);

  const checkPincode = () => {
    if(pincode.length < 3) return;
    setPincodeStatus('checking');
    setTimeout(() => {
      const pinNum = parseInt(pincode);
      if (isNaN(pinNum)) {
        setPincodeStatus('invalid');
        return;
      }
      
      let isValid = true;
      if (product.min_pincode && pinNum < product.min_pincode) isValid = false;
      if (product.max_pincode && pinNum > product.max_pincode) isValid = false;
      
      setPincodeStatus(isValid ? 'valid' : 'invalid');
    }, 800);
  };

  // Dynamic aesthetic pricing
  const mrp = product.mrp || Math.round(product.price * 2.2);
  const discountPct = Math.round(((mrp - product.price) / mrp) * 100);
  const deliveryDays = product.delivery_days || 3;

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      setShowPincodeWarning(true);
      return;
    }
    setIsAdding(true);
    await addToCart(product.id, 1, selectedSize);
    setIsAdding(false);
    addNotificationToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: selectedSize
    });
  };

  const handleBuyNow = async () => {
    if (!canAddToCart) {
      setShowPincodeWarning(true);
      return;
    }
    setIsBuying(true);
    await addToCart(product.id, 1, selectedSize);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col font-sans max-w-2xl">
      
      {/* ---------------- BOUTIQUE BRANDING ---------------- */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-foreground text-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
          Aura Exclusive
        </span>
        <span className="text-muted-foreground text-sm font-medium tracking-wide flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> Trending Now
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-black tracking-tighter text-foreground mb-4">
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Ratings Mock */}
        <div className="flex items-center gap-1 cursor-pointer group" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
           <div className="flex text-amber-500">
             {[1, 2, 3, 4, 5].map((star) => (
               <Star key={star} className={`w-4 h-4 ${star <= Math.round(avgRating) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground stroke-[1.5] fill-transparent'}`} />
             ))}
           </div>
           <span className="text-sm font-semibold ml-1 group-hover:underline text-muted-foreground">
             {totalReviews > 0 ? `${avgRating.toFixed(1)} (${totalReviews} Reviews)` : 'No Reviews Yet'}
           </span>
        </div>
        <span className="text-muted-foreground/30">|</span>
        {/* Availability */}
        <div className="flex items-center text-sm font-semibold tracking-wide">
           {product.is_available === false ? (
              <span className="text-destructive flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Out of Stock</span>
           ) : (
              <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> In Stock - Ready to ship</span>
           )}
        </div>
      </div>
      
      {/* ---------------- PRODUCT TRUST BADGES ---------------- */}
      {(product.originality || product.warranty) && (
        <div className="flex flex-wrap gap-3 mb-8">
          {product.originality && (
            <div className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> {product.originality}
            </div>
          )}
          {product.warranty && (
            <div className="bg-blue-500/10 text-blue-700 border border-blue-500/20 px-3 py-1.5 rounded-md text-xs font-bold tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> {product.warranty}
            </div>
          )}
        </div>
      )}
      
      {/* ---------------- PRICING ENGINE ---------------- */}
      <div className="flex items-end gap-4 mb-4">
        <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex flex-col pb-1.5">
          <span className="text-muted-foreground line-through font-medium text-lg decoration-2 decoration-muted-foreground/40">
            ${mrp.toFixed(2)}
          </span>
        </div>
        <div className="pb-2.5 ml-2">
          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-3 py-1 rounded-full text-sm font-bold tracking-wide">
            Save {discountPct}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-foreground mb-10 bg-muted/30 px-4 py-2.5 rounded-xl border border-border/50 max-w-sm">
        <Truck className="w-4 h-4 text-emerald-600" />
        <span className="font-medium">Order now, get it by <span className="font-bold text-emerald-600">{new Date(Date.now() + 86400000 * deliveryDays).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span></span>
      </div>

      {/* ---------------- SIZE SELECTOR ---------------- */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Select Size</h3>
          <span className="text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors flex items-center gap-1">
            Size Guide <ChevronRight className="w-4 h-4" />
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                selectedSize === size
                  ? 'bg-foreground text-background shadow-lg shadow-black/20 scale-105'
                  : 'bg-muted/50 text-foreground border border-transparent hover:border-border hover:bg-muted'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- TACTILE CHECKOUT BUTTONS ---------------- */}
      
      {showPincodeWarning && !canAddToCart && (
         <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4 py-3 rounded-xl mb-4 text-sm font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 shrink-0" />
            Please verify your delivery pincode below before adding to cart.
         </div>
      )}

      <div className="flex gap-3 mt-2 mb-12 h-16">
        <button 
          onClick={handleAddToCart}
          disabled={!product.is_available || isAdding}
          className={`flex-1 rounded-[1.5rem] font-bold text-lg inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] ${
            !product.is_available 
              ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
              : !canAddToCart 
                ? 'bg-muted/50 text-foreground/50 border border-border/50 hover:bg-muted/80'
                : 'bg-[#ff3f6c] text-white hover:shadow-xl hover:shadow-[#ff3f6c]/30 hover:opacity-95'
          }`}
        >
          {!product.is_available ? 'Out of Stock' : pincodeStatus === 'invalid' ? 'Cannot Deliver' : (
            <><ShoppingBag className="w-5 h-5" /> {isAdding ? 'Adding...' : 'Add to Bag'}</>
          )}
        </button>
        
        <button 
          onClick={handleBuyNow}
          disabled={!product.is_available || isBuying}
          className={`flex-1 rounded-[1.5rem] font-bold text-lg inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] border-2 flex-shrink-0 ${
            !product.is_available 
              ? 'border-border text-muted-foreground cursor-not-allowed'
              : !canAddToCart
                ? 'border-border/50 text-foreground/50 hover:bg-muted/30'
                : 'border-foreground text-foreground hover:bg-muted/50'
          }`}
        >
          {isBuying ? 'Redirecting...' : 'Buy Now'}
        </button>

        <button 
          onClick={() => {
             if (!isWishlisted) {
                addNotificationToWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image_url: product.image_url
                });
             } else {
                removeFromWishlist(product.id);
             }
             setIsWishlisted(!isWishlisted);
          }}
          className={`w-16 h-16 flex-shrink-0 rounded-[1.5rem] border-2 flex items-center justify-center transition-all duration-300 active:scale-[0.90] ${
             isWishlisted 
               ? 'border-[#ff3f6c] bg-[#ff3f6c]/10 text-[#ff3f6c]' 
               : 'border-border text-foreground hover:border-foreground hover:bg-muted/50'
          }`}
        >
           <Heart className={`w-6 h-6 transition-all duration-300 ${isWishlisted ? 'fill-[#ff3f6c]' : ''}`} />
        </button>
      </div>

      {/* ---------------- DELIVERY & SERVICES ---------------- */}
      <div className="pt-8 border-t border-border/50">
        <div className="flex items-center gap-2 mb-4 font-bold tracking-wide uppercase text-sm">
           <MapPin className="w-4 h-4" /> Delivery Options
        </div>
        
        <div className="flex gap-2 mb-4 max-w-sm">
           <input 
             type="text" 
             placeholder="Enter Pincode" 
             value={pincode}
             onChange={(e) => { 
                setPincode(e.target.value); 
                setPincodeStatus('idle'); 
                setShowPincodeWarning(false);
             }}
             className={`flex-1 border rounded-lg px-4 py-2.5 text-sm bg-muted/30 focus:outline-none transition-colors ${showPincodeWarning ? 'border-amber-500 shadow-[0_0_0_2px_rgba(245,158,11,0.2)]' : 'border-border focus:border-foreground'}`}
           />
           <button 
             onClick={checkPincode}
             disabled={pincodeStatus === 'checking' || !pincode}
             className="bg-foreground text-background font-semibold px-6 py-2.5 rounded-lg text-sm disabled:opacity-50"
           >
             {pincodeStatus === 'checking' ? 'Checking...' : 'Check'}
           </button>
        </div>

        {pincodeStatus === 'valid' && (
           <div className="text-emerald-600 text-sm font-semibold mb-6 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
             <CheckCircle2 className="w-4 h-4" /> Delivery available! Expected by {new Date(Date.now() + 86400000 * deliveryDays).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}.
           </div>
        )}
        {pincodeStatus === 'invalid' && (
           <div className="text-destructive text-sm font-semibold mb-6 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
             Delivery is currently unavailable for this pincode.
           </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-3">
             <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
             <div className="flex flex-col">
                <span className="font-semibold text-sm">Complimentary Premium Shipping</span>
                <span className="text-sm text-muted-foreground">Free shipping on all premium collections.</span>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Banknote className="w-5 h-5 text-muted-foreground mt-0.5" />
             <div className="flex flex-col">
                <span className="font-semibold text-sm">Cash on Delivery Available</span>
                <span className="text-sm text-muted-foreground">Pay at your doorstep without hidden fees.</span>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <RefreshCcw className="w-5 h-5 text-muted-foreground mt-0.5" />
             <div className="flex flex-col">
                <span className="font-semibold text-sm">14-Day Refunds & Returns</span>
                <span className="text-sm text-muted-foreground">Bespoke hassle-free return policy. Immediate refunds.</span>
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
