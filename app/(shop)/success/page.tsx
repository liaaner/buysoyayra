import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* Cinematic Checkmark Animation Sequence */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8 animate-in zoom-in duration-500 fade-in">
        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75 duration-1000"></div>
        <div className="relative bg-emerald-500 rounded-full w-24 h-24 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
           <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      <div className="text-center animate-in slide-in-from-bottom-5 fade-in duration-700 delay-300 fill-mode-both">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-foreground">
          Order Secured.
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Thank you for shopping with Aura. Your premium pieces are being prepared for dispatch. We've sent a confirmation email to your account.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/orders" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-foreground font-bold text-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-colors duration-300">
            View My Orders
          </Link>
          <Link href="/" className="w-full sm:w-auto h-14 px-8 rounded-full bg-foreground text-background font-bold flex items-center justify-center hover:shadow-xl hover:shadow-foreground/20 transition-all duration-300 active:scale-95">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
