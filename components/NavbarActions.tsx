'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, User, LogOut, Search, Heart, CheckCircle2, Package } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { signout } from "@/app/(auth)/actions";

type NavbarActionsProps = {
  user: any;
};

export default function NavbarActions({ user }: NavbarActionsProps) {
  const { latestCartItem, latestWishlistItem } = useStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 md:gap-6 shrink-0 z-50">
      
      {user ? (
        <div className="relative flex flex-col items-center" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex flex-col items-center gap-0.5 md:gap-1 cursor-pointer text-foreground/80 hover:text-[#ff3f6c] transition-colors relative focus:outline-none"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] md:text-[11px] font-bold whitespace-nowrap">Profile</span>
          </button>
          
          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute top-10 md:top-12 right-[-20px] md:right-0 w-44 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-border/50 p-2 z-[100]">
              <Link
                href="/orders"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/60 rounded-xl transition-colors"
              >
                <Package className="w-4 h-4" /> My Orders
              </Link>
              <div className="h-px bg-border/40 my-1 mx-2"></div>
              <form action={signout} className="w-full">
                <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-colors focus:outline-none">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="flex flex-col items-center gap-0.5 md:gap-1 text-foreground/80 hover:text-[#ff3f6c] transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[10px] md:text-[11px] font-bold">Profile</span>
        </Link>
      )}
      
      {/* WISHLIST TOGGLE */}
      <div className="relative flex flex-col items-center group">
        <Link href="/wishlist" className="hidden sm:flex flex-col items-center gap-1 text-foreground/80 hover:text-[#ff3f6c] transition-colors">
          <Heart className="w-5 h-5" />
          <span className="text-[11px] font-bold">Wishlist</span>
        </Link>
        
        {/* Wishlist Flyout */}
        {latestWishlistItem && (
          <div className="absolute top-12 right-0 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-border/50 p-4 animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
            <div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold text-sm">
               <CheckCircle2 className="w-4 h-4" /> Added to Wishlist
            </div>
            <div className="flex gap-4">
               <div className="w-16 h-20 bg-muted rounded-md relative overflow-hidden flex-shrink-0 border border-border/50">
                  {latestWishlistItem.image_url && <Image src={latestWishlistItem.image_url} alt="Item" fill className="object-cover" unoptimized={true} />}
               </div>
               <div className="flex flex-col justify-center">
                  <span className="font-bold text-sm leading-tight text-foreground line-clamp-2">{latestWishlistItem.name}</span>
               </div>
            </div>
          </div>
        )}
      </div>
      
      {/* BAG TOGGLE */}
      <div className="relative flex flex-col items-center group">
        <Link href="/cart" className="flex flex-col items-center gap-1 relative text-foreground/80 hover:text-[#ff3f6c] transition-colors">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[11px] font-bold">Bag</span>
          <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#ff3f6c] text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </Link>

        {/* Cart Flyout */}
        {latestCartItem && (
          <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-border/50 p-4 animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold text-sm">
               <CheckCircle2 className="w-4 h-4" /> Added to your Bag
            </div>
            <div className="flex gap-4 mb-4">
               <div className="w-16 h-20 bg-muted rounded-md relative overflow-hidden flex-shrink-0 border border-border/50">
                  {latestCartItem.image_url && <Image src={latestCartItem.image_url} alt="Item" fill className="object-cover" unoptimized={true} />}
               </div>
               <div className="flex flex-col py-1">
                  <span className="font-bold text-sm leading-tight text-foreground line-clamp-2 mb-auto">{latestCartItem.name}</span>
                  <span className="font-bold text-sm text-foreground">${latestCartItem.price?.toFixed(2)}</span>
               </div>
            </div>
            <Link href="/checkout" className="w-full mt-2 h-10 bg-[#ff3f6c] text-white rounded-full font-bold text-sm flex items-center justify-center hover:bg-[#ff3f6c]/90 transition-colors">
               Secure Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
