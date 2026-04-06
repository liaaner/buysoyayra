import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-bold tracking-tight text-lg">
            BUY SOYARA <span className="text-muted-foreground font-normal">Admin Portal</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin/support" className="hover:text-primary transition-colors text-muted-foreground">Support Desk</Link>
            <Link href="/" className="hover:text-muted-foreground text-primary">Return to Shop &rarr;</Link>
            {user && (
              <span className="bg-muted px-2 py-1 rounded-md text-xs">{user.email}</span>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
