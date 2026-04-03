import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { chatApi } from '../services/api';
import { useAuthStore } from '@/stores/authStore';

export const Chatbot = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && isAuthenticated && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen, isAuthenticated]);

  const loadHistory = async () => {
    try {
      const response = await chatApi.getHistory();
      if (response.data && response.data.history) {
        setMessages(response.data.history);
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(userMessage.content);
      setMessages((prev) => [...prev, { role: 'ai', content: response.data.ai_response }]);
    } catch (error) {
      console.error('Failed to send message', error);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const location = useLocation();
  const hiddenRoutes = ['/', '/login', '/register'];

  if (!isAuthenticated || hiddenRoutes.includes(location.pathname)) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed z-50 bottom-6 right-6 h-14 w-14 rounded-full shadow-xl gradient-primary transition-transform hover:scale-110"
          size="icon"
        >
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[500px] flex flex-col h-full bg-background/95 backdrop-blur-xl border-l border-border p-0">
        <SheetHeader className="border-b border-border p-4 bg-muted/30">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Bot className="h-5 w-5 text-primary" />
            StartupIQ Advisor
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-xs mt-10">
              Welcome to StartupIQ! Ask me anything about building, marketing, or funding your business idea.
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-foreground" />}
              </div>
              <div className={`rounded-xl px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-foreground border border-border shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <Bot className="h-4 w-4 text-foreground" />
              </div>
              <div className="rounded-xl px-4 py-2.5 text-sm bg-muted text-foreground border border-border shadow-sm flex items-center gap-1 min-w-[60px]">
                <span className="animate-bounce text-lg leading-none">.</span>
                <span className="animate-bounce text-lg leading-none" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-bounce text-lg leading-none" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-border bg-background focus-within:bg-muted/10 transition-colors">
          <div className="relative">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Ask for startup advice..." 
              className="pr-12 py-6 bg-muted/50 border-border shadow-inner"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()} 
              className="absolute right-1 top-1 h-10 w-10 rounded-xl gradient-primary transition-opacity disabled:opacity-50"
            >
              <Send className="h-4 w-4 text-primary-foreground" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};
