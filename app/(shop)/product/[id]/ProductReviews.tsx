'use client';

import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { submitReview } from './reviewActions';

export default function ProductReviews({ 
  productId, 
  initialReviews, 
  isEligibleToReview 
}: { 
  productId: string, 
  initialReviews: any[],
  isEligibleToReview: boolean 
}) {
  const [reviews] = useState(initialReviews);
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : '0.0';

  const calculateDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => { if(dist[r.rating as keyof typeof dist] !== undefined) dist[r.rating as keyof typeof dist]++; });
    return [5, 4, 3, 2, 1].map(stars => ({
      stars,
      pct: totalReviews > 0 ? Math.round((dist[stars as keyof typeof dist] / totalReviews) * 100) : 0
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
         setErrorStatus("Image size must be less than 5MB");
         return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setErrorStatus('Please select a star rating.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorStatus('');
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('product_id', productId);
      formData.append('rating', rating.toString());
      if (selectedImage) formData.append('image', selectedImage);
      
      await submitReview(formData);
      setIsWriting(false);
      // Wait for server revalidation or we could optimistically update
    } catch (err: any) {
      setErrorStatus(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-24 px-4 xl:px-0 border-t border-border/60 pt-16 font-sans">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-12">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-24">
        
        {/* Left Side: Summary & Distribution */}
        <div className="flex flex-col">
          <div className="flex items-end gap-3 mb-4">
            <span className="text-6xl font-black leading-none tracking-tighter">{avgRating}</span>
            <div className="flex flex-col pb-1">
               <div className="flex text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(parseFloat(avgRating)) ? 'fill-amber-500' : 'text-muted-foreground stroke-[1.5]'}`} />
                  ))}
               </div>
               <span className="text-sm font-semibold text-muted-foreground">Based on {totalReviews} reviews</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            {calculateDistribution().map(row => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="text-sm font-bold w-12 text-foreground">{row.stars} Stars</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: `${row.pct}%` }}></div>
                </div>
                <span className="text-sm font-semibold text-muted-foreground w-8 text-right">{row.pct}%</span>
              </div>
            ))}
          </div>

          {isEligibleToReview ? (
            <button 
              onClick={() => setIsWriting(!isWriting)}
              className="w-full mt-10 h-14 rounded-full border-2 border-foreground text-foreground font-bold hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              {isWriting ? 'Cancel Review' : 'Write a Review'}
            </button>
          ) : (
            <div className="mt-10 p-4 border border-border/50 bg-muted/30 rounded-xl text-center text-sm text-muted-foreground">
              You can review this item after it has been delivered.
            </div>
          )}
        </div>

        {/* Right Side: Review List */}
        <div className="flex flex-col gap-10">
          
          {isWriting && (
            <div className="bg-muted/10 border border-border/60 p-6 xl:p-8 rounded-2xl mb-4 animate-in fade-in slide-in-from-top-4">
              <h3 className="text-xl font-bold mb-6">Share Your Experience</h3>
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                 
                 <div>
                    <label className="text-sm font-bold mb-2 block">Overall Rating</label>
                    <div className="flex gap-1.5 cursor-pointer" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                         <Star 
                           key={star} 
                           onClick={() => setRating(star)}
                           onMouseEnter={() => setHoverRating(star)}
                           className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} 
                         />
                      ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-sm font-bold mb-2 block">Review Title</label>
                    <input name="title" required type="text" placeholder="Summary of your experience" className="w-full rounded-xl border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground" />
                 </div>

                 <div>
                    <label className="text-sm font-bold mb-2 block">Review Details</label>
                    <textarea name="body" required rows={4} placeholder="What did you love about it?" className="w-full rounded-xl border border-border px-4 py-3 bg-transparent focus:outline-none focus:border-foreground resize-none"></textarea>
                 </div>

                 <div>
                    <label className="text-sm font-bold mb-2 block">Upload a Photo <span className="text-muted-foreground font-normal">(Optional)</span></label>
                    <div className="flex items-center gap-4">
                       <input type="file" id="review-image" accept="image/*" onChange={handleImageChange} className="hidden" />
                       <label htmlFor="review-image" className="cursor-pointer flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-foreground transition-colors w-32 h-32 rounded-xl text-muted-foreground hover:text-foreground">
                         {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover rounded-xl" />
                         ) : (
                            <div className="flex flex-col items-center gap-2"><ImageIcon className="w-6 h-6" /><span className="text-xs font-semibold">Add Photo</span></div>
                         )}
                       </label>
                       {imagePreview && (
                         <button type="button" onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="text-sm font-bold text-destructive hover:underline">Remove Photo</button>
                       )}
                    </div>
                 </div>

                 {errorStatus && <p className="text-destructive text-sm font-semibold mt-2">{errorStatus}</p>}

                 <button type="submit" disabled={isSubmitting} className="h-12 bg-foreground text-background font-bold rounded-xl mt-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                 </button>
              </form>
            </div>
          )}
          {reviews.length === 0 && !isWriting ? (
             <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
               <Star className="w-12 h-12 mb-4 opacity-20" />
               <p className="font-semibold text-lg">No reviews yet.</p>
               <p className="text-sm mt-1">Be the first to share what you think!</p>
             </div>
          ) : (
            reviews.map((review) => {
              const authorEmail = review.users?.email || 'Customer';
              const displayName = authorEmail.split('@')[0];
              const displayDate = new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

              return (
              <div key={review.id} className="flex flex-col border-b border-border/50 pb-10 last:border-0">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground">
                         {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                           {displayName} 
                           <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                         </span>
                         <span className="text-xs font-semibold text-muted-foreground tracking-wide">{displayDate}</span>
                      </div>
                   </div>
                   <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500' : 'text-muted-foreground stroke-[1.5]'}`} />
                      ))}
                   </div>
                </div>
                
                {review.title && <h4 className="font-bold text-lg text-foreground mb-2 mt-1">{review.title}</h4>}
                <p className="text-muted-foreground leading-relaxed text-[15px] max-w-3xl">{review.body}</p>
                
                {review.image_url && (
                  <div className="mt-4 border border-border/50 rounded-xl overflow-hidden w-48 h-64 relative">
                    <img src={review.image_url} alt="Review attachment" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-5">
                   <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors border border-border px-3 py-1.5 rounded-full">
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful
                   </button>
                   <span className="text-xs font-semibold text-muted-foreground cursor-pointer hover:underline">Report</span>
                </div>
              </div>
            )})
          )}

          <button className="w-max mx-auto text-sm font-bold text-foreground border-b-2 border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-colors">
            Load More Reviews
          </button>
        </div>

      </div>
    </div>
  );
}
