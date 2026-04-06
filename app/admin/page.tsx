import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { MapPin, User, Phone } from "lucide-react";
import { addProduct, deleteProduct, toggleProductAvailability, updateOrderStatus, updateProductPrice } from "./actions";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || '';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Check if admin
  const { data: profile, error } = await supabase.from('users').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'admin') {
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl inline-block text-left text-sm">
          <p><strong>System Diagnostics:</strong></p>
          <p>Your Authenticated ID: {user.id}</p>
          <p>Database Role Read as: <b>{profile?.role ? `'${profile.role}'` : "NULL (Profile not found)"}</b></p>
          {error && <p>Database Error: {error.message}</p>}
        </div>
        <p className="mt-4 text-sm bg-muted inline-block p-4 rounded-xl border border-border block mx-auto max-w-lg mt-8">
          Note: To test this locally, go to your Supabase Dashboard &gt; Table Editor &gt; <br/>
          Users table &gt; change your user&apos;s role column to &apos;admin&apos; and <strong>refresh this page</strong>.
        </p>
      </div>
    );
  }

  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  
  let ordersQuery = supabase.from('orders').select('*, order_items(*, products(*))').order('created_at', { ascending: false });
  if (search) {
    ordersQuery = ordersQuery.ilike('id', `%${search}%`);
  }
  const { data: orders } = await ordersQuery;

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Admin Command Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Add Product</h2>
            <form action={addProduct} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input name="name" required className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <textarea name="description" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" rows={3}></textarea>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Price ($)</label>
                <input name="price" type="number" step="0.01" required className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Image</label>
                  <input name="image" type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Image 2 (Opt)</label>
                  <input name="image_2" type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-muted-foreground hover:file:opacity-90" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Image 3 (Opt)</label>
                  <input name="image_3" type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-muted-foreground hover:file:opacity-90" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Image 4 (Opt)</label>
                  <input name="image_4" type="file" accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-muted file:text-muted-foreground hover:file:opacity-90" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <input name="category" placeholder="e.g. Clothing" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Originality (Optional)</label>
                  <input name="originality" placeholder="e.g. 100% Genuine Brand" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Warranty (Optional)</label>
                  <input name="warranty" placeholder="e.g. 1 Year Guarantee" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Min Pincode</label>
                  <input name="min_pincode" type="number" placeholder="e.g. 100000" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Max Pincode</label>
                  <input name="max_pincode" type="number" placeholder="e.g. 999999" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">MRP (Original Price)</label>
                  <input name="mrp" type="number" step="0.01" placeholder="e.g. 660.00" className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Est. Delivery Days</label>
                  <input name="delivery_days" type="number" defaultValue={3} className="w-full rounded-md px-3 py-2 border border-border bg-transparent" />
                </div>
              </div>
              <button type="submit" className="bg-primary text-primary-foreground font-medium rounded-md py-2 mt-4 hover:opacity-90 transition-opacity">
                Create Product
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Product Catalog</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground w-16">Image</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground w-1/3">Product</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground min-w-[200px]">Pricing & MRP</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Pincodes</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Availability</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products?.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden border border-border">
                        {product.image_url ? (
                          <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized={true} />
                        ) : (
                          <span className="text-[10px] absolute inset-0 flex items-center justify-center text-muted-foreground">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">
                      <form action={updateProductPrice} className="flex gap-2 items-center">
                        <input type="hidden" name="id" value={product.id} />
                        <div className="flex flex-col gap-1 w-full max-w-[80px]">
                           <span className="text-[10px] text-muted-foreground">Sell Price</span>
                           <input type="number" step="0.01" name="price" defaultValue={product.price} className="border border-border rounded px-2 py-1 text-xs" />
                        </div>
                        <div className="flex flex-col gap-1 w-full max-w-[80px]">
                           <span className="text-[10px] text-muted-foreground line-through">MRP</span>
                           <input type="number" step="0.01" name="mrp" defaultValue={product.mrp || (product.price * 2.2).toFixed(2)} className="border border-border rounded px-2 py-1 text-xs" />
                        </div>
                        <div className="flex flex-col gap-1 w-full max-w-[50px]">
                           <span className="text-[10px] text-muted-foreground">Days</span>
                           <input type="number" name="delivery_days" defaultValue={product.delivery_days || 3} className="border border-border rounded px-2 py-1 text-xs" />
                        </div>
                        <button className="text-[10px] bg-primary text-primary-foreground px-2 py-1.5 rounded mt-4">Save</button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {product.min_pincode && product.max_pincode ? `${product.min_pincode} - ${product.max_pincode}` : 'All Regions'}
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleProductAvailability}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="is_available" value={String(product.is_available)} />
                        <button 
                          className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                            product.is_available 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                              : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                          }`}
                        >
                          {product.is_available ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button className="text-red-500 hover:underline">Delete</button>
                      </form>
                    </td>
                  </tr>
                ))}
                {!products?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold">Order Management</h2>
          <form method="GET" className="flex gap-2">
            <input 
              type="text" 
              name="search" 
              defaultValue={search} 
              placeholder="Search by Order ID..." 
              className="border border-border bg-transparent rounded-md px-3 py-1.5 text-sm outline-none w-full max-w-xs"
            />
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm hover:opacity-90">
              Search
            </button>
            {search && (
              <a href="/admin" className="px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground flex items-center">
                Clear
              </a>
            )}
          </form>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1000px]">
             <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Order ID</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Customer</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground min-w-[250px]">Items</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Date</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Total</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders?.map((order) => {
                  const baseAddress = order.address?.includes(' - Pincode: ') ? order.address.split(' - Pincode: ')[0] : order.address;
                  const pincodeExtract = order.address?.includes(' - Pincode: ') ? order.address.split(' - Pincode: ')[1] : order.pincode;

                  return (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                    <td className="px-6 py-4 vertical-align-top">
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                           <User className="w-3.5 h-3.5 text-muted-foreground" /> {order.name}
                        </p>
                        <div className="bg-muted/50 p-2.5 rounded-lg border border-border/50 max-w-[240px]">
                           <div className="text-muted-foreground text-xs leading-relaxed flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-foreground" />
                              <span className="break-words">{baseAddress}</span>
                           </div>
                           {pincodeExtract && (
                             <div className="text-foreground text-xs font-semibold mt-2 pt-2 border-t border-border/50">
                               Pincode: {pincodeExtract}
                             </div>
                           )}
                        </div>
                        {order.phone && (
                          <div className="text-muted-foreground text-xs flex items-center gap-1.5 px-1">
                             <Phone className="w-3.5 h-3.5 shrink-0" /> {order.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-3">
                        {order.order_items?.map((item: any) => (
                           <div key={item.id} className="flex items-center gap-3">
                             <div className="relative w-10 h-10 rounded border border-border overflow-hidden bg-muted flex-shrink-0">
                                {item.products?.image_url ? (
                                  <Image src={item.products.image_url} alt="" fill className="object-cover" unoptimized />
                                ) : (
                                  <span className="text-[8px] absolute inset-0 flex items-center justify-center text-muted-foreground">No img</span>
                                )}
                             </div>
                             <div className="text-xs">
                               <p className="font-medium line-clamp-1">{item.products?.name || 'Unknown Product'}</p>
                               <div className="flex gap-2 text-muted-foreground mt-0.5">
                                 <span>Qty: {item.quantity}</span>
                                 {item.size && <span>| Size: {item.size}</span>}
                               </div>
                             </div>
                           </div>
                        ))}
                        {!order.order_items?.length && <span className="text-muted-foreground text-xs">No items found</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">${order.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-full text-xs border whitespace-nowrap ${
                          order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-orange-500/10 text-orange-500 border-orange-500/20'
                       }`}>
                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={updateOrderStatus} className="flex justify-end gap-2">
                         <input type="hidden" name="id" value={order.id} />
                         <select 
                           name="status" 
                           defaultValue={order.status}
                           className="bg-transparent border border-border rounded-md px-2 py-1 text-sm outline-none"
                         >
                           <option value="pending">Pending</option>
                           <option value="processing">Processing</option>
                           <option value="shipped">Shipped</option>
                           <option value="delivered">Delivered</option>
                           <option value="cancelled">Cancelled</option>
                         </select>
                         <button className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs hover:opacity-90">
                           Update
                         </button>
                      </form>
                    </td>
                  </tr>
                )})}
                {!orders?.length && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
