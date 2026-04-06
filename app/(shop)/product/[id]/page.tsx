import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import ProductActions from "./ProductActions";
import ProductReviews from "./ProductReviews";
import ProductImageZoom from "./ProductImageZoom";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Buy ${product.name} at Soyara.`,
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160) || `Buy ${product.name} at Soyara.`,
      url: `/product/${product.id}`,
      images: product.image_url ? [product.image_url, ...previousImages] : previousImages,
    },
  };
}
export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: product } = await supabase.from('products').select('*').eq('id', params.id).single();

  if (!product) {
    notFound();
  }

  const { data: { user } } = await supabase.auth.getUser();

  let isEligibleToReview = false;

  if (user) {
    const { data: eligibleOrderItems } = await supabase
      .from('order_items')
      .select('id, orders!inner(user_id, status)')
      .eq('product_id', params.id)
      .eq('orders.user_id', user.id)
      .eq('orders.status', 'delivered');
      
    if (eligibleOrderItems && eligibleOrderItems.length > 0) {
      isEligibleToReview = true;
    }
  }

  // Fetch Reviews + User Info
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, title, body, image_url, created_at, users(email)')
    .eq('product_id', params.id)
    .order('created_at', { ascending: false });

  // Fetch Similar Products
  const { data: similarProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category || '')
    .neq('id', product.id)
    .limit(4);
    
  const totalReviews = reviews?.length || 0;
  const avgRating = totalReviews > 0 
    ? (reviews!.reduce((acc, rev) => acc + rev.rating, 0) / totalReviews) 
    : 0;

  const productImages = [
    product.image_url, 
    product.image_url_2, 
    product.image_url_3, 
    product.image_url_4
  ].filter(Boolean);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buysoyara.shop';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: productImages.length > 0 ? productImages : undefined,
    description: product.description,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    },
    ...(totalReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: totalReviews,
      }
    })
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-sm text-muted-foreground/60 tracking-wider pt-8 pb-10 px-4 xl:px-0 uppercase font-semibold">
        <span className="hover:text-foreground cursor-pointer transition-colors">Home</span> <span className="mx-2">/</span> 
        <span className="hover:text-foreground cursor-pointer transition-colors">{product.category || 'Collection'}</span> <span className="mx-2">/</span> 
        <span className="text-foreground">Premium Series</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[4.5fr_6fr] gap-12 lg:gap-16 px-4 xl:px-0 items-start">
        {/* Left Image: Floating Interactive Zoom Layout */}
        <div className="w-full relative lg:sticky top-8 z-40 max-w-xl mx-auto mb-8 lg:mb-0">
          {productImages.length > 0 ? (
            <ProductImageZoom images={productImages} alt={product.name} />
          ) : (
             <div className="w-full relative aspect-[3/4] lg:aspect-[4/5] bg-[#f8f9fa] rounded-[2rem] overflow-hidden shadow-2xl shadow-black/5 border border-border flex items-center justify-center text-muted-foreground">
               No Image Available
             </div>
          )}
        </div>
        
        {/* Right Info Layout */}
        <div className="w-full flex flex-col py-8 pb-16">
          <ProductActions product={product} avgRating={avgRating} totalReviews={totalReviews} />
        </div>
      </div>

      <ProductReviews 
        productId={product.id} 
        initialReviews={reviews || []} 
        isEligibleToReview={isEligibleToReview} 
      />

      {similarProducts && similarProducts.length > 0 && (
        <section className="mt-24 px-4 xl:px-0">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-center text-[#1a1a1a] tracking-tighter uppercase mb-4">You May Also Like</h2>
            <div className="w-24 h-1 bg-[#ccff00] mb-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
