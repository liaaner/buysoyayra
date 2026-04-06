export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0f111a] text-slate-300 border-t border-white/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div>
            <h3 className="font-black tracking-tighter text-2xl text-white mb-4">BUY SOYARA</h3>
            <p className="text-sm text-slate-400">
              Premium essentials for the modern lifestyle. Elevated design, uncompromising quality.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm text-white uppercase tracking-wider">Shop</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="/search" className="hover:text-primary transition-colors">All Products</a></li>
              <li><a href="/search?q=men" className="hover:text-primary transition-colors">Men's Collection</a></li>
              <li><a href="/search?q=women" className="hover:text-primary transition-colors">Women's Collection</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="/support" className="hover:text-primary transition-colors">Help Center & Chat</a></li>
              <li><a href="/orders" className="hover:text-primary transition-colors">Track Your Order</a></li>
              <li><a href="/support" className="hover:text-primary transition-colors">Returns & Refunds</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Buy Soyara. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Premium E-commerce</span>
            <span>Secured Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
