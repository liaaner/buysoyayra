import Link from "next/link";
import { ShoppingBag, User, LogOut, Search, Heart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/(auth)/actions";
import NavbarActions from "./NavbarActions";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      {/* Top Value Proposition Bar */}
      <div className="w-full bg-primary text-white py-1.5 md:py-2 px-2 text-center text-[10px] md:text-xs font-bold tracking-wider uppercase border-b border-white/20">
        ⚡ SUMMER CARNIVAL IS LIVE | EXTRA 20% OFF ON ORDERS ABOVE ₹1999 | EASY 30-DAY RETURNS
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container mx-auto px-2 md:px-4 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-2 md:gap-6">
        
        {/* LOGO */}
        <Link href="/" className="text-xl md:text-3xl font-black tracking-tighter shrink-0 flex items-center group">
          <span className="text-[#282c3f] tracking-widest uppercase">BUY</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3f6c] to-[#0082c3] italic pr-1 group-hover:scale-105 transition-transform duration-300">Soyara</span>
        </Link>
        
        {/* CENTER NAVIGATION */}
        <nav className="hidden md:flex flex-1 items-center justify-start ml-8 gap-8 text-[13px] font-bold tracking-widest text-foreground/90 uppercase">
          <Link href="/search?q=men" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Men</Link>
          <Link href="/search?q=women" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Women</Link>
          <Link href="/search?q=kids" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Kids</Link>
          <Link href="/search?q=tech" className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">Tech</Link>
          {user && (
            <>
              <Link href="/orders" className="hover:text-primary transition-all text-muted-foreground">Orders</Link>
              <Link href="/support" className="hover:text-primary transition-all text-muted-foreground">Support</Link>
            </>
          )}
        </nav>
        
        {/* BIG SEARCH BAR */}
        <div className="flex-1 max-w-sm hidden lg:block shrink-0">
          <form action="/search" method="GET" className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input 
              type="text" 
              name="q" 
              placeholder="Search for products, brands and more" 
              className="w-full bg-muted border border-transparent rounded-[4px] py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-border focus:bg-background transition-all"
            />
          </form>
        </div>

        {/* RIGHT ICONS MODULARIZED */}
        <NavbarActions user={user} />
      </div>

      {/* MOBILE SPECIFIC EXACT LAYOUT (Search) */}
      <div className="lg:hidden w-full bg-white px-3 pb-3 flex items-center shadow-sm">
        <form action="/search" method="GET" className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            name="q" 
            placeholder="Search for Products, Brands..." 
            className="w-full border-[1.5px] border-[#2874f0] rounded-[6px] py-1.5 pl-9 pr-3 text-[13px] text-black font-medium focus:outline-none placeholder-gray-500 bg-[#f0f5ff]/30 shadow-inner"
          />
        </form>
      </div>
    </header>
  </>
  );
}
