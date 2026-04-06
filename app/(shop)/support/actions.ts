'use server'

import { createClient } from "@/utils/supabase/server"

export async function createSupportTicket(category: string, initialMessage: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not logged in" }

  // 1. Create ticket
  const { data: ticket, error: ticketError } = await supabase
    .from('support_tickets')
    .insert({ user_id: user.id, category, status: 'open' })
    .select('id')
    .single()

  if (ticketError || !ticket) return { error: "Failed to create ticket" }

  // 2. Insert Bot intro message
  await supabase.from('support_messages').insert({
    ticket_id: ticket.id,
    sender: 'bot',
    text: `System: Issue categorized as "${category}". An admin will be connected shortly. Please drop any details below.`
  })

  // 3. Insert User's initial contextual message
  if (initialMessage) {
    await supabase.from('support_messages').insert({
      ticket_id: ticket.id,
      sender: 'user',
      text: initialMessage
    })
  }

  return { ticketId: ticket.id }
}

export async function sendUserMessage(ticketId: string, text: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not logged in" }

  const { error } = await supabase.from('support_messages').insert({
    ticket_id: ticketId,
    sender: 'user',
    text
  })
  
  if (error) return { error: error.message }
  return { success: true }
}

export async function getActiveTicket() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch the most recently opened ticket
  const { data } = await supabase
    .from('support_tickets')
    .select('id, status, category')
    .eq('user_id', user.id)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function getTicketMessages(ticketId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('support_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  return data || []
}
