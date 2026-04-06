'use client'

import { useState, useEffect, useRef } from 'react'
import { sendAdminMessage, resolveTicket, getAdminTickets, getAdminMessages } from './actions'
import { User, Bot, AlertCircle, CheckCircle, Send, Plus } from 'lucide-react'

// I need to add getAdminTickets and getAdminMessages to actions.ts first.
// Wait, I will write them.

export default function AdminSupportDashboard({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState(initialTickets || [])
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedTicket = tickets.find(t => t.id === selectedTicketId)

  useEffect(() => {
    // Poll for new tickets every 10s
    const ticketInterval = setInterval(async () => {
      const ts = await getAdminTickets()
      if (ts) setTickets(ts)
    }, 10000)
    return () => clearInterval(ticketInterval)
  }, [])

  useEffect(() => {
    let msgInterval: NodeJS.Timeout
    if (selectedTicketId) {
      fetchMessages(selectedTicketId)
      msgInterval = setInterval(() => {
        fetchMessages(selectedTicketId)
      }, 5000)
    }
    return () => { if (msgInterval) clearInterval(msgInterval) }
  }, [selectedTicketId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (id: string) => {
    const msgs = await getAdminMessages(id)
    if (msgs) setMessages(msgs)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedTicketId) return
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('ticket_id', selectedTicketId)
    formData.append('text', inputText)
    await sendAdminMessage(formData)
    
    setInputText('')
    await fetchMessages(selectedTicketId)
    setIsSubmitting(false)
  }

  const handleResolve = async () => {
    if (!selectedTicketId) return
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('ticket_id', selectedTicketId)
    await resolveTicket(formData)
    
    // Refresh tickets
    const ts = await getAdminTickets()
    if (ts) setTickets(ts)
    setSelectedTicketId(null)
    setIsSubmitting(false)
  }

  return (
    <div className="flex h-[80vh] border rounded-2xl overflow-hidden bg-card shadow-sm">
      {/* Sidebar - Ticket List */}
      <div className="w-1/3 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b bg-muted/50 font-bold uppercase tracking-wider text-xs">
          Open Tickets ({tickets.filter(t => t.status === 'open').length})
        </div>
        <div className="flex-1 overflow-y-auto">
          {tickets.map(ticket => (
            <button 
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedTicketId === ticket.id ? 'bg-muted border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-bold text-sm line-clamp-1">{ticket.user?.email || 'Unknown User'}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${ticket.status === 'open' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-green-500/20 text-green-700'}`}>
                  {ticket.status}
                </span>
              </div>
              <span className="text-xs text-muted-foreground block mb-2">{ticket.category}</span>
              <span className="text-[10px] text-muted-foreground">{new Date(ticket.created_at).toLocaleString()}</span>
            </button>
          ))}
          {tickets.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No active tickets
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedTicketId ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between bg-card shrink-0">
              <div>
                <h2 className="font-bold">Ticket: {selectedTicket?.category}</h2>
                <p className="text-xs text-muted-foreground">{selectedTicket?.user?.email}</p>
              </div>
              {selectedTicket?.status === 'open' && (
                <button 
                  onClick={handleResolve}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Resolve Ticket
                </button>
              )}
            </div>

            {/* Chat Log */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-muted/10">
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender === 'admin'
                const isSystem = msg.sender === 'bot'
                return (
                  <div key={idx} className={`flex gap-3 max-w-[80%] ${isAdmin ? 'ml-auto flex-row-reverse' : isSystem ? 'mx-auto max-w-[90%]' : ''}`}>
                    {!isSystem && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-primary text-primary-foreground' : 'bg-slate-800 text-white'}`}>
                        {isAdmin ? <User size={16} /> : <User size={16} />}
                      </div>
                    )}
                    <div className={`p-3 text-sm ${isSystem ? 'bg-transparent text-center text-muted-foreground border border-dashed rounded-xl px-6 py-2' : isAdmin ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none' : 'bg-card border rounded-2xl rounded-tl-none'}`}>
                      {!isSystem && <span className="block text-[10px] font-bold opacity-70 mb-1 tracking-wider uppercase">{isAdmin ? 'You' : 'Customer'}</span>}
                      {msg.text}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            {selectedTicket?.status === 'open' && (
              <div className="p-4 bg-card border-t shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Reply to customer..."
                    className="flex-1 bg-muted border-transparent rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim() || isSubmitting}
                    className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    Send <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a ticket from the left sidebar to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
