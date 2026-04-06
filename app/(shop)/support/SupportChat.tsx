'use client'

import { useState, useEffect, useRef } from 'react'
import { createSupportTicket, sendUserMessage, getActiveTicket, getTicketMessages } from './actions'
import { Send, User as UserIcon, Bot, ShieldAlert, Loader2 } from 'lucide-react'

export default function SupportChat() {
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputText, setInputText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const ticket = await getActiveTicket()
      if (ticket) {
        setTicketId(ticket.id)
        await fetchMessages(ticket.id)
      }
      setIsInitializing(false)
    }
    init()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (ticketId) {
      interval = setInterval(() => {
        fetchMessages(ticketId)
      }, 5000) // Poll every 5s
    }
    return () => clearInterval(interval)
  }, [ticketId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async (id: string) => {
    const msgs = await getTicketMessages(id)
    setMessages(msgs)
  }

  const handleStartChat = async (category: string) => {
    setIsSubmitting(true)
    const res = await createSupportTicket(category, "")
    if (res?.ticketId) {
      setTicketId(res.ticketId)
      await fetchMessages(res.ticketId)
    }
    setIsSubmitting(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !ticketId) return

    const tempMsg = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputText,
      created_at: new Date().toISOString()
    }
    setMessages([...messages, tempMsg])
    setInputText('')
    setIsSubmitting(true)
    
    await sendUserMessage(ticketId, tempMsg.text)
    await fetchMessages(ticketId)
    setIsSubmitting(false)
  }

  if (isInitializing) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  if (!ticketId) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-card border rounded-2xl shadow-sm text-center">
        <Bot className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tight">How can we help you?</h1>
        <p className="text-muted-foreground mb-8">Our automated assistant will gather your details and connect you with a human support agent.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={() => handleStartChat("Order Delay")}
            disabled={isSubmitting}
            className="p-6 border-2 hover:border-primary hover:bg-primary/5 rounded-xl text-left transition-all group"
          >
            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">📦 Order Delay</h3>
            <p className="text-sm text-muted-foreground">Check the status of a delayed delivery</p>
          </button>
          
          <button 
            onClick={() => handleStartChat("Refund & Return")}
            disabled={isSubmitting}
            className="p-6 border-2 hover:border-primary hover:bg-primary/5 rounded-xl text-left transition-all group"
          >
            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">💸 Refund & Return</h3>
            <p className="text-sm text-muted-foreground">Start a return or track a refund</p>
          </button>
          
          <button 
            onClick={() => handleStartChat("Product Issue")}
            disabled={isSubmitting}
            className="p-6 border-2 hover:border-primary hover:bg-primary/5 rounded-xl text-left transition-all group"
          >
            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">⚠️ Product Issue</h3>
            <p className="text-sm text-muted-foreground">Report a defective or wrong item</p>
          </button>
          
          <button 
            onClick={() => handleStartChat("Other")}
            disabled={isSubmitting}
            className="p-6 border-2 hover:border-primary hover:bg-primary/5 rounded-xl text-left transition-all group"
          >
            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">💬 Other Query</h3>
            <p className="text-sm text-muted-foreground">Anything else you need help with</p>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-8 bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col h-[70vh]">
      <div className="bg-muted px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          <div>
            <h2 className="font-bold">Support Chat</h2>
            <p className="text-xs text-muted-foreground">We usually reply in a few minutes</p>
          </div>
        </div>
        <div className="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Active Ticket
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-muted/30">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user'
          const isAdmin = msg.sender === 'admin'
          return (
            <div key={idx} className={`flex gap-3 max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-primary text-primary-foreground' : isAdmin ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-white'}`}>
                {isUser ? <UserIcon size={16} /> : isAdmin ? <ShieldAlert size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${isUser ? 'bg-primary text-primary-foreground rounded-tr-none' : isAdmin ? 'bg-indigo-500/10 text-foreground rounded-tl-none border border-indigo-500/20' : 'bg-card border rounded-tl-none'}`}>
                {isAdmin && <span className="block text-[10px] font-bold text-indigo-500 uppercase mb-1">Human Agent</span>}
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-muted border-transparent rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isSubmitting}
            className="bg-primary text-primary-foreground p-3 rounded-full hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}
