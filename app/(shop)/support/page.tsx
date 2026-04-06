import SupportChat from "./SupportChat"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function SupportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/support')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Help Center</h1>
        <p className="text-muted-foreground mt-2 font-medium">How can we assist you today?</p>
      </div>
      
      <SupportChat />
    </div>
  )
}
