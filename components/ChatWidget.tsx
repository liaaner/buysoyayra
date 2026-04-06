'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Bot, User, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { createSupportTicket, sendUserMessage, getActiveTicket } from '@/app/(shop)/support/actions'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasCheckedContext, setHasCheckedContext] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initial Context Load
  useEffect(() => {
    async function init() {
      const active = await getActiveTicket()
      if (active) {
        setTicketId(active.id)
        fetchMessages(active.id)
      }
      setHasCheckedContext(true)
    }
    init()
  }, [])

  // Realtime Subscription
  useEffect(() => {
    if (!ticketId) return

    const channel = supabase
      .channel(`ticket_${ticketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${ticketId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [ticketId])

  const fetchMessages = async (tId: string) => {
    const { data } = await supabase
      .from('support_messages')
      .select('*')
      .eq('ticket_id', tId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  const startTicket = async (category: string) => {
    setIsLoading(true)
    const res = await createSupportTicket(category, "")
    if (res.ticketId) {
      setTicketId(res.ticketId)
      await fetchMessages(res.ticketId)
    }
    setIsLoading(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !ticketId) return
    
    setIsLoading(true)
    const text = input.trim()
    setInput('')
    await sendUserMessage(ticketId, text)
    setIsLoading(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-foreground text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[300px] sm:w-[350px] h-[500px] max-h-[80vh] bg-background border border-border shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-foreground text-background p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm leading-tight">Help & Support</h3>
              <p className="text-[10px] text-background/70">Typically replies in a few minutes</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-background/20 p-1.5 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messaging Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/20">
          {!hasCheckedContext ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
               <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : !ticketId ? (
            // Phase 1: Bot Menu
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-sm text-sm border border-border/50">
                  Hi there! I'm the automated store assistant. To process your request efficiently, please choose a category below:
                </div>
              </div>
              
              <div className="flex flex-col gap-2 pl-10 mt-2">
                {['Where is my order?', 'Request a Refund', 'Item is defective', 'Other Support'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => startTicket(cat)}
                    disabled={isLoading}
                    className="text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/5 bg-background p-2.5 rounded-lg text-left transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Phase 3: Live Chat Stream
            <>
               <div className="text-center text-[10px] uppercase font-bold text-muted-foreground my-2 flex items-center gap-2">
                  <div className="h-px bg-border flex-1"></div>
                  Ticket #{ticketId.substring(0,6)} Open
                  <div className="h-px bg-border flex-1"></div>
               </div>
               
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                      msg.sender === 'user' ? 'bg-primary/20 text-primary' 
                      : msg.sender === 'bot' ? 'bg-amber-100 text-amber-700' 
                      : 'bg-foreground text-background'
                    }`}>
                       {msg.sender === 'user' ? <User className="w-3 h-3" /> : msg.sender === 'bot' ? <Bot className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div className={`p-2.5 rounded-2xl text-[13px] ${
                       msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                       : 'bg-muted border border-border/50 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Phase 3: Input Area */}
        {ticketId && (
          <div className="shrink-0 p-3 bg-background border-t border-border">
            <form onSubmit={sendMessage} className="flex items-center gap-2 relative">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..." 
                disabled={isLoading}
                className="flex-1 bg-muted/50 border border-border rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
