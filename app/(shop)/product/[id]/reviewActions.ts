'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to submit a review.');
  }

  const productId = formData.get('product_id') as string;
  const rating = parseInt(formData.get('rating') as string);
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const imageFile = formData.get('image') as File | null;

  if (!productId || isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error('Invalid input data.');
  }

  // 1. Verify eligibility (User must have ordered this product and it must be delivered)
  const { data: eligibleOrderItems } = await supabase
    .from('order_items')
    .select('id, orders!inner(user_id, status)')
    .eq('product_id', productId)
    .eq('orders.user_id', user.id)
    .eq('orders.status', 'delivered');

  if (!eligibleOrderItems || eligibleOrderItems.length === 0) {
    throw new Error('You can only review products that have been delivered to you.');
  }

  let imageUrl = null;

  // 2. Handle Image Upload
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}_${productId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('reviews')
      .upload(fileName, imageFile);

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('reviews')
      .getPublicUrl(fileName);

    imageUrl = publicUrl;
  }

  // 3. Insert Review
  const { error } = await supabase.from('reviews').insert({
    product_id: productId,
    user_id: user.id,
    rating,
    title,
    body,
    image_url: imageUrl
  });

  if (error) {
    if (error.code === '23505') {
       throw new Error('You have already submitted a review for this product.');
    }
    throw new Error('Failed to submit review.');
  }

  revalidatePath(`/product/${productId}`);
}
