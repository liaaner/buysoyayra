'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')
  return user
}

export async function sendAdminMessage(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const ticketId = formData.get('ticket_id') as string
  const text = formData.get('text') as string

  if (!ticketId || !text.trim()) return

  await supabase.from('support_messages').insert({
    ticket_id: ticketId,
    sender: 'admin',
    text: text.trim()
  })

  revalidatePath('/admin/support')
}

export async function resolveTicket(formData: FormData) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const ticketId = formData.get('ticket_id') as string

  // Mark ticket closed
  await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', ticketId)

  // Send a final system text
  await supabase.from('support_messages').insert({
    ticket_id: ticketId,
    sender: 'bot',
    text: 'System: Admin has successfully closed this ticket.'
  })

  revalidatePath('/admin/support')
}

export async function getAdminTickets() {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const { data } = await supabase
    .from('support_tickets')
    .select(`
      *,
      user:users(email)
    `)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getAdminMessages(ticketId: string) {
  const supabase = await createClient()
  await requireAdmin(supabase)

  const { data } = await supabase
    .from('support_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  return data || []
}
