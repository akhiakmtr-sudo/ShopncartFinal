
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { getChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from "@google/genai";

/**
 * AIChat component provides a floating chat interface for customers
 * to interact with a Gemini-powered herbal expert assistant.
 */
const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Initialize chat session on first message
      if (!chatRef.current) {
        chatRef.current = getChatSession();
      }

      // Start streaming response from Gemini
      const stream = await chatRef.current.sendMessageStream({ message: input });
      
      let assistantMessage: ChatMessage = { role: 'model', text: '', isStreaming: true };
      setMessages(prev => [...prev, assistantMessage]);

      let fullText = '';
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullText += text;
          // Update the last message (the assistant's response) with new text chunks
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (lastIndex >= 0 && newMessages[lastIndex].role === 'model') {
              newMessages[lastIndex] = { ...newMessages[lastIndex], text: fullText };
            }
            return newMessages;
          });
        }
      }
      
      // Finalize streaming state
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0 && newMessages[lastIndex].role === 'model') {
          newMessages[lastIndex] = { ...newMessages[lastIndex], text: fullText, isStreaming: false };
        }
        return newMessages;
      });

    } catch (error) {
      console.error('Gemini Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'I apologize, but I am having trouble connecting right now. Please try again later.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Assistant Header */}
          <div className="bg-blue-900 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-brand p-1.5 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Herbal Assistant</h3>
                <p className="text-[10px] text-blue-200 flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />
                  Online | Knowledgeable
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/10 p-1 rounded-full transition-colors outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Chat Messages Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10 px-6">
                <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-brand border border-green-50">
                  <MessageSquare size={28} />
                </div>
                <p className="text-sm text-gray-800 font-bold">Welcome to Green Leaf Herbals!</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  I'm your wellness assistant. Ask me anything about our Ayurvedic products or usage tips.
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-brand text-white rounded-tr-none shadow-md shadow-green-100' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                  {msg.isStreaming && <span className="inline-block w-1 h-3 bg-brand/50 ml-1 animate-pulse" />}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* User Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="How can I help you today?"
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand focus:bg-white transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 p-2 bg-brand text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center"
              >
                {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-brand text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group relative border-4 border-white"
          aria-label="Open chat assistant"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-bounce"></div>
          <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default AIChat;
