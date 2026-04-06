import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { updateCartItem, removeCartItem } from "./actions";

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?error=Please log in to view your cart');
  }

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      size,
      products!inner ( id, name, price, image_url )
    `)
    .eq('user_id', user.id);

  const items = cartItems as any; // Type override for inner join

  const total = items?.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl flex-1 flex flex-col">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Your Cart</h1>
      
      {!items?.length ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="text-muted-foreground mb-6">Your cart is currently empty.</div>
          <Link href="/" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item: any) => (
              <div key={item.id} className="flex gap-6 py-6 border-b border-border">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#f8f9fa] rounded-xl relative overflow-hidden flex-shrink-0 border border-border/50">
                  {item.products.image_url && <Image src={item.products.image_url} alt={item.products.name} fill className="object-cover transition-transform hover:scale-105 duration-500" unoptimized={true} />}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.products.name}</h3>
                    {item.size && <p className="text-xs font-semibold text-muted-foreground mt-0.5">Size: {item.size}</p>}
                    <p className="font-medium text-muted-foreground mt-1">${item.products.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                     <div className="flex items-center border border-border rounded-md">
                       <form action={async () => { 'use server'; await updateCartItem(item.id, item.quantity - 1); }}>
                         <button className="px-3 py-1 hover:bg-muted text-muted-foreground">-</button>
                       </form>
                       <span className="px-4 font-medium">{item.quantity}</span>
                       <form action={async () => { 'use server'; await updateCartItem(item.id, item.quantity + 1); }}>
                         <button className="px-3 py-1 hover:bg-muted text-muted-foreground">+</button>
                       </form>
                     </div>
                     <form action={async () => { 'use server'; await removeCartItem(item.id); }}>
                        <button className="text-red-500 p-2 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                     </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-muted/50 p-8 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              <div className="flex justify-between mb-4 text-muted-foreground">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between mb-8 text-xl font-bold border-t border-border pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold flex justify-center items-center gap-2 hover:opacity-90">
                Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
