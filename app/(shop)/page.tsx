import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";
import HeroSlider from "@/components/HeroSlider";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Promotional Strip */}
      <div className="w-full bg-[#fcf2ed] py-2 md:py-3 px-2 text-center border-b border-border">
        <p className="text-[#2b1e16] font-bold text-[11px] md:text-[13px] tracking-wide uppercase">
          FLAT ₹300 OFF <span className="font-normal mx-1 md:mx-2 opacity-50">|</span> On Your 1st Purchase Via App!
        </p>
      </div>

      <HeroSlider />

      {/* Secondary Bottom Promotional Strip */}
      <div className="w-full bg-[#f4f4f5] py-3 md:py-4 border-y border-border mb-8 md:mb-12 shadow-inner">
        <div className="container mx-auto px-2 md:px-4 text-center flex flex-col md:flex-row items-center justify-center gap-3 md:gap-12">
           <div className="flex items-center gap-2 bg-white px-4 py-1.5 md:px-6 md:py-2 rounded shadow-sm border border-border w-full md:w-auto justify-center">
             <span className="text-lg md:text-xl font-black text-[#e80000] tracking-tighter italic pr-1 md:pr-2">HSBC</span>
             <span className="font-bold text-[13px] md:text-[15px] tracking-wide text-[#282c3f]">10% Instant Discount*</span>
           </div>
           <div className="hidden md:block text-muted-foreground font-black text-xl italic">+</div>
           <div className="flex items-center gap-2 bg-white px-4 py-1.5 md:px-6 md:py-2 rounded shadow-sm border border-border w-full md:w-auto justify-center">
             <span className="text-lg md:text-xl font-black text-[#ff681a] tracking-widest italic pr-1 md:pr-2">BOBCARD</span>
             <span className="font-bold text-[13px] md:text-[15px] tracking-wide text-[#282c3f]">10% Instant Discount*</span>
           </div>
        </div>
      </div>

      {/* Bold Category Breakout (Budli/Myntra Style) */}
      <section className="container mx-auto px-2 md:px-4 mb-16 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Left Block - Pink Accent */}
          <div className="border shadow-sm rounded-xl p-5 md:p-8 bg-white transition-all transform hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl md:text-2xl font-black text-center text-[#282c3f] mb-6 md:mb-8 tracking-tighter uppercase">Shop Men</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
               <Link href="/search?q=men%20shirts" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-br from-[#ff3f6c] to-[#e82550] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(255,63,108,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Shirts</span>
                 </div>
               </Link>
               <Link href="/search?q=men%20jeans" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-br from-[#ff3f6c] to-[#e82550] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(255,63,108,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Jeans</span>
                 </div>
               </Link>
               <Link href="/search?q=men%20shoes" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-br from-[#ff3f6c] to-[#e82550] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(255,63,108,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Shoes</span>
                 </div>
               </Link>
               <Link href="/search?q=watches" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-br from-[#ff3f6c] to-[#e82550] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(255,63,108,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Watches</span>
                 </div>
               </Link>
            </div>
          </div>

          {/* Right Block - Blue Accent */}
          <div className="border shadow-sm rounded-xl p-5 md:p-8 bg-white transition-all transform hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl md:text-2xl font-black text-center text-[#282c3f] mb-6 md:mb-8 tracking-tighter uppercase">Shop Women</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <Link href="/search?q=women%20dresses" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-bl from-[#0082c3] to-[#005a9e] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(0,130,195,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Dresses</span>
                 </div>
               </Link>
               <Link href="/search?q=women%20tops" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-bl from-[#0082c3] to-[#005a9e] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(0,130,195,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Tops</span>
                 </div>
               </Link>
               <Link href="/search?q=women%20heels" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-bl from-[#0082c3] to-[#005a9e] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(0,130,195,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Heels</span>
                 </div>
               </Link>
               <Link href="/search?q=jewelry" className="group flex flex-col items-center">
                 <div className="w-full aspect-square bg-gradient-to-bl from-[#0082c3] to-[#005a9e] rounded-xl flex items-center justify-center text-white transition-all transform group-hover:scale-105 shadow-[0_8px_20px_rgba(0,130,195,0.4)]">
                    <span className="font-bold text-sm tracking-widest uppercase">Jewelry</span>
                 </div>
               </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Collections */}
      {/* Featured Collections */}
      <section className="container mx-auto px-4 mb-24">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1a1a1a] tracking-tighter uppercase mb-4">Featured Collections</h2>
          <div className="w-24 h-1 bg-[#ccff00] mb-4"></div>
          <p className="text-center text-slate-500 max-w-2xl font-medium">Curated edits from our premium selections. Elevated design, uncompromising quality.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Makeup Column */}
          <div className="col-span-1 rounded-2xl pt-10 pb-0 px-8 flex flex-col justify-between overflow-hidden relative group bg-[#f8f9fa] border border-slate-100 hover:shadow-xl transition-all duration-500">
            <div className="text-center z-10 relative">
              <span className="bg-black text-white text-[10px] font-bold tracking-widest px-3 py-1.5 uppercase rounded-sm mb-4 inline-block">Best Seller</span>
              <h3 className="text-4xl font-black text-[#1a1a1a] mb-2 tracking-tighter">MAKEUP</h3>
              <p className="text-slate-500 font-medium leading-snug mb-8 text-sm">Save up to <span className="text-black font-black">72%</span><br/>on premium brands.</p>
              <Link href="/shop/beauty" className="inline-flex flex-col items-center text-[#1a1a1a] font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors group-hover:-translate-y-1">
                <span className="border-b-2 border-[#1a1a1a] pb-1 group-hover:border-primary">Shop Now</span>
              </Link>
            </div>
            <div className="relative w-full aspect-[4/5] mt-6 -mb-6 mix-blend-multiply scale-110 origin-bottom group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700">
              <Image src="/promo_makeup.png" alt="Makeup" fill className="object-cover object-bottom drop-shadow-2xl" />
            </div>
          </div>

          {/* Dresses Column */}
          <div className="col-span-1 rounded-2xl pt-6 pb-12 px-8 flex flex-col justify-between overflow-hidden relative group bg-[#f8f9fa] border border-slate-100 hover:shadow-xl transition-all duration-500">
            <div className="relative w-full aspect-square -mt-4 mix-blend-multiply scale-110 group-hover:scale-105 transition-transform duration-700">
              <Image src="/promo_dresses.png" alt="Dresses" fill className="object-contain drop-shadow-2xl" />
            </div>
            <div className="text-center z-10 relative mt-4">
              <span className="bg-[#ccff00] text-black text-[10px] font-black tracking-widest px-3 py-1.5 uppercase rounded-sm mb-4 inline-block">Trending</span>
              <h3 className="text-4xl font-black text-[#1a1a1a] mb-2 tracking-tighter">DRESSES</h3>
              <p className="text-slate-500 font-medium leading-snug mb-8 text-sm">Summer Mega Sale<br/><span className="text-black font-black">Up to 66% Off</span></p>
              <Link href="/shop/women/dresses" className="inline-flex bg-[#1a1a1a] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-[#ccff00] hover:text-black transition-all group-hover:scale-105 shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Stacked Handbags & Perfumes Column */}
          <div className="col-span-1 flex flex-col gap-6">
            
            {/* Handbags Card */}
            <div className="flex-1 rounded-2xl p-8 flex items-center relative overflow-hidden group bg-[#1a1a1a] hover:shadow-xl transition-all duration-500">
              <div className="z-20 w-[55%]">
                <span className="text-[#ccff00] text-[10px] font-black tracking-widest uppercase mb-2 block">Luxury</span>
                <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">HANDBAGS</h3>
                <p className="text-slate-400 font-medium leading-snug mb-6 text-xs">Designer Bags<br/><span className="text-white font-bold">Up to 51% Off</span></p>
                <Link href="/shop/accessories/bags" className="inline-flex border border-white text-white font-bold uppercase tracking-widest text-[10px] px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                  Explore
                </Link>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-[45%] group-hover:scale-105 transition-transform duration-700">
                <Image src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80" unoptimized alt="Handbags" fill className="object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent"></div>
              </div>
            </div>

            {/* Perfumes Card */}
            <div className="flex-1 rounded-2xl p-8 flex items-center relative overflow-hidden group bg-[#f8f9fa] border border-slate-100 hover:shadow-xl transition-all duration-500">
              <div className="z-20 w-[60%]">
                <span className="bg-black text-white text-[10px] font-bold tracking-widest px-2 py-1 uppercase rounded-sm mb-2 inline-block">Exclusive</span>
                <h3 className="text-3xl font-black text-[#1a1a1a] mb-2 tracking-tighter">PERFUMES</h3>
                <p className="text-slate-500 font-medium leading-snug mb-6 text-xs">Designer Scents<br/><span className="text-black font-bold">Up to 66% Off</span></p>
                <Link href="/shop/beauty/fragrances" className="inline-flex flex-col items-start text-[#1a1a1a] font-bold uppercase tracking-widest text-[10px] hover:text-primary transition-colors">
                  <span className="border-b-2 border-[#1a1a1a] pb-1 group-hover:border-primary">Buy Now</span>
                </Link>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-[50%] mix-blend-multiply scale-125 translate-x-4 origin-right group-hover:scale-110 transition-transform duration-700">
                <Image src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80" unoptimized alt="Perfumes" fill className="object-cover object-right bg-white" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Shop By Category Section */}
      <section className="container mx-auto px-4 mb-24">
        {/* Header Banner */}
        <div className="w-full bg-gradient-to-b from-[#fffaf0] to-[#ffecb3] rounded-t-xl py-10 md:py-16 mb-4 border border-[#fce49c]">
          <h2 className="text-4xl md:text-5xl font-black text-center text-[#1E3A8A] tracking-tight">
            Shop By Category
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Ethnic Wear", discount: "50-80% OFF", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80", link: "/search?q=ethnic" },
            { name: "Casual Wear", discount: "40-80% OFF", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80", link: "/search?q=casual" },
            { name: "Men's Activewear", discount: "30-70% OFF", img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80", link: "/search?q=men activewear" },
            { name: "Women's Activewear", discount: "30-70% OFF", img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80", link: "/search?q=women activewear" },
            { name: "Western Wear", discount: "40-80% OFF", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", link: "/search?q=western" },
            { name: "Sportswear", discount: "30-80% OFF", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80", link: "/search?q=sportswear" },
            { name: "Loungewear", discount: "30-60% OFF", img: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=400&q=80", link: "/search?q=loungewear" },
            { name: "Innerwear", discount: "UP TO 70% OFF", img: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=400&q=80", link: "/search?q=innerwear" },
            { name: "Electronics", discount: "UP TO 80% OFF", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80", link: "/search?q=electronics" },
            { name: "Watches", discount: "UP TO 80% OFF", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80", link: "/search?q=watches" },
            { name: "Accessories", discount: "UP TO 60% OFF", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=400&q=80", link: "/search?q=accessories" },
            { name: "Beauty & Makeup", discount: "UP TO 60% OFF", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", link: "/search?q=beauty" },
          ].map((cat, idx) => (
            <Link href={cat.link} key={idx} className="group flex flex-col bg-[#ffedb3] p-3 rounded-sm hover:-translate-y-1 transition-all border border-[#fce49c]">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-white mb-3 shadow-inner">
                <Image src={cat.img} alt={cat.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="text-center flex flex-col gap-1.5 pb-2">
                <span className="text-[#a24e23] font-bold text-[13px]">{cat.name}</span>
                <span className="text-2xl font-black text-[#d62828] leading-none tracking-tighter">{cat.discount}</span>
                <span className="text-[#a24e23] font-bold text-xs uppercase tracking-wider mt-1">Shop Now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="py-24 w-full bg-[#fcfaf8] border-t border-[#f0e6d2]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="bg-[#ccff00] text-black text-[10px] font-black tracking-[0.2em] px-3 py-1 uppercase mb-4 inline-block shadow-[2px_2px_0_#ff3f6c]">
                Fresh Drops
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1a1a1a] mb-4 uppercase">
                New Arrivals
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                The absolute latest pieces from our cutting-edge collection. Discover your next obsession before it sells out.
              </p>
            </div>
            <Link 
              href="/shop" 
              className="group flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-black text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 hover:shadow-xl shadow-black/20"
            >
              View Full Collection 
              <span className="bg-white/20 p-1.5 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.length ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center py-12 col-span-full border border-dashed border-border rounded-lg text-muted-foreground">
                No products found. Be sure to add some from the Admin dashboard!
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
