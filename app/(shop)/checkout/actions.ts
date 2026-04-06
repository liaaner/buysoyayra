'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function placeOrder(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const firstName = formData.get('name') as string
  const lastName = formData.get('lastName') as string
  const name = lastName ? `${firstName} ${lastName}`.trim() : firstName;
  
  const addressInput = formData.get('address') as string
  const pincode = formData.get('pincode') as string
  const address = pincode ? `${addressInput} - Pincode: ${pincode}` : addressInput;
  
  const phone = formData.get('phone') as string

  // Get cart items to calculate total and create order items
  const { data: cartItems } = await supabase
    .from('cart_items')
    .select(`id, quantity, size, product_id, products ( price )`)
    .eq('user_id', user.id)

  if (!cartItems || cartItems.length === 0) {
    redirect('/cart?error=Cart is empty')
  }

  const items = cartItems as any
  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0)

  // Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      name,
      address,
      phone,
      total_amount: totalAmount,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError || !order) {
    redirect('/checkout?error=Failed to place order')
  }

  // Insert Order Items
  const orderItemsData = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    size: item.size,
    price: item.products.price
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData)

  if (itemsError) {
    console.error("Failed to insert order items:", itemsError)
  }

  // Clear Cart
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  redirect('/success')
}
