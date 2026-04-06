'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addToCart(productId: string, quantity: number = 1, size: string | null = null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=Please log in to add items to your cart')
  }

  // Check if item already exists with exact same size
  let query = supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('product_id', productId)
    .eq('user_id', user.id);

  if (size) {
    query = query.eq('size', size);
  } else {
    query = query.is('size', null);
  }

  const { data: existing } = await query.single();

  if (existing) {
    await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
  } else {
    await supabase.from('cart_items').insert({
      product_id: productId,
      user_id: user.id,
      quantity,
      size
    })
  }

  revalidatePath('/cart')
  redirect('/cart')
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('id', cartItemId).eq('user_id', user.id)
  } else {
    await supabase.from('cart_items').update({ quantity }).eq('id', cartItemId).eq('user_id', user.id)
  }

  revalidatePath('/cart')
}

export async function removeCartItem(cartItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('cart_items').delete().eq('id', cartItemId).eq('user_id', user.id)
  revalidatePath('/cart')
}
