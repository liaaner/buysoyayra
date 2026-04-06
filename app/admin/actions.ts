'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function requireAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')
}

export async function addProduct(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const min_pincode = formData.get('min_pincode') ? parseInt(formData.get('min_pincode') as string) : null;
  const max_pincode = formData.get('max_pincode') ? parseInt(formData.get('max_pincode') as string) : null;
  const originality = formData.get('originality') as string || null;
  const warranty = formData.get('warranty') as string || null;
  const mrp = formData.get('mrp') ? parseFloat(formData.get('mrp') as string) : null;
  const delivery_days = formData.get('delivery_days') ? parseInt(formData.get('delivery_days') as string) : 3;
  
  // Handle up to 4 images
  const imageKeys = ['image', 'image_2', 'image_3', 'image_4'];
  const uploadedUrls = ['', '', '', ''];

  for (let i = 0; i < imageKeys.length; i++) {
    const imageFile = formData.get(imageKeys[i]) as File | null;
    
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, {
           cacheControl: '3600',
           upsert: false
        });
        
      if (uploadError) {
        throw new Error(`Failed to upload ${imageKeys[i]}: ${uploadError.message}`);
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
        
      uploadedUrls[i] = publicUrl;
    }
  }

  const { error } = await supabase.from('products').insert({
    name, 
    description, 
    price, 
    category, 
    min_pincode, 
    max_pincode,
    originality,
    warranty,
    mrp,
    delivery_days,
    image_url: uploadedUrls[0] || null,
    image_url_2: uploadedUrls[1] || null,
    image_url_3: uploadedUrls[2] || null,
    image_url_4: uploadedUrls[3] || null
  })

  if (error) console.error("Error creating product", error)

  revalidatePath('/', 'layout')
  revalidatePath('/admin')
}

export async function deleteProduct(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const id = formData.get('id') as string
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) console.error("Error deleting product", error)

  revalidatePath('/', 'layout')
  revalidatePath('/admin')
}

export async function toggleProductAvailability(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const id = formData.get('id') as string
  const isAvailable = formData.get('is_available') === 'true'

  const { error } = await supabase.from('products').update({ is_available: !isAvailable }).eq('id', id)

  if (error) console.error("Error toggling product", error)

  revalidatePath('/', 'layout')
  revalidatePath('/admin')
}

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const id = formData.get('id') as string
  const status = formData.get('status') as string

  const { error } = await supabase.from('orders').update({ status }).eq('id', id)

  if (error) console.error("Error updating order status", error)

  revalidatePath('/', 'layout')
  revalidatePath('/admin')
}

export async function updateProductPrice(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const id = formData.get('id') as string
  const mrp = parseFloat(formData.get('mrp') as string)
  const price = parseFloat(formData.get('price') as string)
  const delivery_days = parseInt(formData.get('delivery_days') as string)

  const { error } = await supabase.from('products').update({ mrp, price, delivery_days }).eq('id', id)

  if (error) console.error("Error updating product price", error)

  revalidatePath('/', 'layout')
  revalidatePath('/admin')
}
