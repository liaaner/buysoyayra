import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {!orders?.length ? (
        <div className="text-center py-20 bg-muted/50 rounded-2xl border border-border">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't made any purchases.</p>
          <Link href="/#shop" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card p-6 rounded-xl border border-border flex flex-col gap-4">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Order #{order.id.slice(0, 8)}</div>
                    <div className="font-semibold text-lg">${order.total_amount.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-green-500/20 text-green-600'}`}>
                      {order.status}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                 {order.order_items?.map((item: any) => (
                   <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-20 bg-muted rounded-md overflow-hidden border border-border shrink-0">
                        {item.products?.image_url ? (
                          <img src={item.products.image_url} alt={item.products.name || "Product"} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No img</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm line-clamp-2 leading-tight">{item.products?.name}</span>
                        <div className="text-muted-foreground text-xs mt-1 space-x-2 flex items-center">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>• Size: {item.size}</span>}
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
