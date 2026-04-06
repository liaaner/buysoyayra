import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  is_available?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`group flex flex-col h-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 ${product.is_available === false ? 'opacity-70' : 'cursor-pointer hover:-translate-y-2'}`}>
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] bg-[#f8f9fa] mb-5 overflow-hidden rounded-xl">
        {product.is_available === false ? (
          <div className="absolute top-4 left-4 z-40 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-lg">
            Sold Out
          </div>
        ) : (
          <div className="absolute top-4 left-4 z-40 bg-[#ccff00] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
            New
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-sm tracking-widest uppercase bg-slate-100">
            No Image
          </div>
        )}

        <div className="absolute bottom-6 left-0 w-full px-6 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex justify-center">
          <span className="w-full text-center bg-white text-black text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:bg-[#1a1a1a] hover:text-white transition-colors">
            Quick View
          </span>
        </div>
      </Link>
      
      <div className="flex flex-col flex-1 px-2 pb-2 text-center">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">{product.category}</p>
        <h3 className="font-bold text-[#1a1a1a] text-lg tracking-tight leading-snug line-clamp-1 mb-2">
          <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>
        <span className="font-black text-[#1a1a1a] text-xl mt-auto">${product.price.toFixed(2)}</span>
      </div>
    </div>
  );
}
