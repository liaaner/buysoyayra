import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { placeOrder } from "./actions";
import Image from "next/image";
import { ShoppingBag, ChevronRight, Lock } from "lucide-react";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?error=Please log in to checkout');

  // Supabase query expanded to get precise product data (name, category, image)
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`quantity, products!inner ( id, name, price, image_url, category )`)
    .eq('user_id', user.id);

  const items = cartItems as any;
  const total = items?.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0) || 0;

  if (!items || items.length === 0 || total === 0) {
    redirect('/cart'); // Send them back to cart if nothing is here
  }

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24">
      {/* Checkout Navbar/Header */}
      <div className="border-b border-border/50 bg-white shadow-sm mb-12">
         <div className="max-w-6xl mx-auto px-4 xl:px-0 h-20 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter uppercase">Buy Soyara<span className="text-muted-foreground font-medium lowercase">.checkout</span></h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
               <Lock className="w-4 h-4" /> Secure SSL Checkout
            </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 xl:px-0 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* Left Column: Checkout Forms */}
        <div className="lg:col-span-7 flex flex-col">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Shipping Address</h2>
          
          <form action={placeOrder} className="flex flex-col gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">First Name</label>
                    <input name="name" required className="w-full border-b-2 border-border/50 bg-transparent px-2 py-3 text-base font-semibold focus:outline-none focus:border-foreground transition-colors placeholder:font-normal placeholder:text-muted-foreground/50" placeholder="Jane" />
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Last Name</label>
                    <input name="lastName" required className="w-full border-b-2 border-border/50 bg-transparent px-2 py-3 text-base font-semibold focus:outline-none focus:border-foreground transition-colors placeholder:font-normal placeholder:text-muted-foreground/50" placeholder="Doe" />
                 </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Full Address</label>
                <textarea name="address" required rows={2} className="w-full border-b-2 border-border/50 bg-transparent px-2 py-3 text-base font-semibold focus:outline-none focus:border-foreground transition-colors resize-none placeholder:font-normal placeholder:text-muted-foreground/50" placeholder="123 Luxury Ave, Apt 4B, New York, NY 10012" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Pincode / Zip</label>
                    <input name="pincode" type="text" required className="w-full border-b-2 border-border/50 bg-transparent px-2 py-3 text-base font-semibold focus:outline-none focus:border-foreground transition-colors placeholder:font-normal placeholder:text-muted-foreground/50" placeholder="10012" />
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Phone Number</label>
                    <input name="phone" type="tel" required className="w-full border-b-2 border-border/50 bg-transparent px-2 py-3 text-base font-semibold focus:outline-none focus:border-foreground transition-colors placeholder:font-normal placeholder:text-muted-foreground/50" placeholder="+1 (555) 000-0000" />
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50 mt-4">
               <h2 className="text-2xl font-bold tracking-tight mb-8">Payment Method</h2>
               <div className="p-6 border border-border/50 rounded-2xl bg-white shadow-sm flex items-center justify-between cursor-not-allowed opacity-70">
                  <span className="font-semibold text-foreground">Cash on Delivery</span>
                  <div className="w-5 h-5 rounded-full border-[5px] border-foreground"></div>
               </div>
            </div>
            
            <button type="submit" className="w-full h-16 bg-foreground text-background rounded-full font-bold text-lg mt-8 hover:shadow-2xl hover:shadow-foreground/20 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Complete Purchase
            </button>
          </form>
        </div>


        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
           <div className="sticky top-10 bg-white p-8 rounded-3xl border border-border/50 shadow-2xl shadow-black/5">
              <h3 className="text-xl font-bold tracking-tight mb-6">Order Summary</h3>

              <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                 {items.map((item: any) => (
                    <div key={item.products.id} className="flex gap-4">
                       <div className="relative w-20 h-24 bg-[#f8f9fa] rounded-xl overflow-hidden border border-border/50 flex-shrink-0">
                          {item.products.image_url ? (
                             <Image 
                               src={item.products.image_url} 
                               alt={item.products.name} 
                               fill 
                               className="object-cover" 
                               unoptimized={true} 
                             />
                          ) : (
                             <div className="w-full h-full bg-muted"></div>
                          )}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white z-10">
                             {item.quantity}
                          </div>
                       </div>
                       <div className="flex flex-col flex-1 pt-1 border-b border-border/30 pb-4">
                          <h4 className="font-bold text-sm tracking-tight text-foreground line-clamp-2 leading-tight mb-1">{item.products.name}</h4>
                          <span className="text-xs font-semibold text-muted-foreground uppercase">{item.products.category}</span>
                          <span className="font-semibold text-sm mt-auto">${item.products.price.toFixed(2)}</span>
                       </div>
                    </div>
                 ))}
              </div>

              <hr className="border-border/50 mb-6" />

              <div className="space-y-3 mb-6 font-medium text-sm text-muted-foreground">
                 <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-emerald-600">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="text-foreground">$0.00</span>
                 </div>
              </div>

              <hr className="border-border/50 mb-6" />

              <div className="flex justify-between items-end">
                 <span className="text-base font-semibold">Total</span>
                 <span className="text-3xl font-black tracking-tighter">${total.toFixed(2)}</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
