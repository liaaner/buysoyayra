import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, X } from "lucide-react";
import Link from "next/link";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const query = params.q;
  const categoryParam = params.category;
  const minPriceParam = params.min_price;
  const maxPriceParam = params.max_price;

  const searchQuery = typeof query === 'string' ? query : '';
  const category = typeof categoryParam === 'string' ? categoryParam : '';
  const minPrice = typeof minPriceParam === 'string' ? parseFloat(minPriceParam) : 0;
  const maxPrice = typeof maxPriceParam === 'string' ? parseFloat(maxPriceParam) : 0;

  const supabase = await createClient();
  
  // Start base query (fetches ALL by default now)
  let supaQuery = supabase.from('products').select('*');

  if (searchQuery) {
    supaQuery = supaQuery.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }
  if (category) {
    supaQuery = supaQuery.ilike('category', `%${category}%`);
  }
  if (minPrice > 0) {
    supaQuery = supaQuery.gte('price', minPrice);
  }
  if (maxPrice > 0) {
    supaQuery = supaQuery.lte('price', maxPrice);
  }

  const { data } = await supaQuery.order('created_at', { ascending: false });
  const products = data || [];

  // Helper function to generate URLs while preserving existing params
  const buildUrl = (updates: Record<string, string | null>) => {
    const usp = new URLSearchParams();
    if (searchQuery) usp.set('q', searchQuery);
    if (category) usp.set('category', category);
    if (minPrice > 0) usp.set('min_price', minPrice.toString());
    if (maxPrice > 0) usp.set('max_price', maxPrice.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) usp.delete(key);
      else usp.set(key, value);
    });

    return `/search?${usp.toString()}`;
  };

  const hasFilters = category !== '' || minPrice > 0 || maxPrice > 0;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Product Catalog'}
        </h1>
        <p className="text-muted-foreground">
          {products.length} product{products.length !== 1 && 's'} available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Amazon-Style Sidebar */}
        <div className="w-full lg:w-1/4 shrink-0">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-lg font-bold border-b border-border pb-4">
              <Filter className="w-5 h-5" /> Filters
              {hasFilters && (
                <Link href={buildUrl({ category: null, min_price: null, max_price: null })} className="ml-auto text-xs font-semibold text-red-500 hover:text-red-600 outline-none flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear All
                </Link>
              )}
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Category</h3>
              <ul className="space-y-3">
                {[
                  { name: 'All', value: null },
                  { name: 'Clothing', value: 'Clothing' },
                  { name: 'Accessories', value: 'Accessories' },
                  { name: 'Tech', value: 'Tech' },
                  { name: 'Home', value: 'Home' },
                ].map((cat) => (
                  <li key={cat.name}>
                    <Link 
                      href={buildUrl({ category: cat.value })}
                      className={`text-sm transition-colors hover:text-primary ${
                        (category === cat.value || (cat.name === 'All' && !category)) 
                          ? 'font-bold text-primary' 
                          : 'text-muted-foreground text-foreground'
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-4">Price Range</h3>
              <ul className="space-y-3">
                {[
                   { name: 'Any Price', min: null, max: null },
                   { name: 'Under $50', min: null, max: '50' },
                   { name: '$50 to $100', min: '50', max: '100' },
                   { name: '$100 to $200', min: '100', max: '200' },
                   { name: 'Above $200', min: '200', max: null },
                ].map((range) => {
                  const isActive = (minPrice === (range.min ? parseFloat(range.min) : 0)) && 
                                   (maxPrice === (range.max ? parseFloat(range.max) : 0));
                  return (
                    <li key={range.name}>
                      <Link 
                        href={buildUrl({ min_price: range.min, max_price: range.max })}
                        className={`text-sm transition-colors hover:text-primary ${
                          isActive ? 'font-bold text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {range.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4 flex-grow">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed border-border/50 h-full flex flex-col items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No matching products found</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                We couldn't find anything matching your current filters and search query. 
              </p>
              <Link 
                href="/search" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
