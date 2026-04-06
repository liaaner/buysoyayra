import { adminLogin } from "../auth/actions";
import Link from "next/link";

export default async function AdminLoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-24 pb-24">
      <h1 className="text-3xl font-bold mb-2 text-center">Admin Login</h1>
      <p className="text-center text-muted-foreground mb-6">Staff portal access.</p>
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-background border border-border"
          name="email"
          placeholder="admin@buysoyara.store"
          required
        />
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-background border border-border"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button formAction={adminLogin} className="bg-primary text-primary-foreground rounded-md px-4 py-3 mt-4 hover:opacity-90 font-medium">
          Secure Login
        </button>
      </form>
    </div>
  );
}
