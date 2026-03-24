'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SYSTEM_INSTRUCTION = `You are Astra, an adaptive AI tutor. Your job is to teach concepts clearly, like a calm and intelligent teacher.
When a user asks a question, ALWAYS respond in this structured format:

1. Explanation:
- Explain the concept in a simple and clear way
- Use real-life analogies if possible

2. Visual Idea:
- Describe a simple diagram or visualization that helps understand the concept

3. Summary:
- Give 3–5 key bullet points
- Keep it exam-focused

4. Checkpoint Question:
- Ask one question to test understanding

5. Teaching Style:
- Be calm, slightly witty, and encouraging
- Never be too casual or too robotic

IMPORTANT:
- Keep answers structured and easy to read
- Focus on teaching, not just answering
- Do NOT skip any section`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      
      // Map history to Gemini format
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add the current message
      history.push({
        role: 'user',
        parts: [{ text: input }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || 'I apologize, but I encountered an issue while thinking. Shall we try again?' 
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I seem to have lost my train of thought. Please check your connection or try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-3xl mx-auto card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#5A5A40]/10 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#5A5A40] flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[#5A5A40]">Astra</h2>
            <p className="text-xs text-[#5A5A40]/60 uppercase tracking-widest font-sans">Adaptive AI Tutor</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fdfdfb]">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <Sparkles size={48} className="text-[#5A5A40]" />
            <p className="text-lg italic">&quot;The mind is not a vessel to be filled, but a fire to be kindled.&quot;</p>
            <p className="text-sm font-sans uppercase tracking-wider">What concept shall we explore today?</p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-[#1a1a1a] text-white' : 'bg-[#5A5A40] text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1a1a1a] text-white rounded-tr-none' 
                    : 'bg-white text-[#1a1a1a] rounded-tl-none border border-[#5A5A40]/5'
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 items-center text-[#5A5A40]/60 italic">
              <Loader2 className="animate-spin" size={16} />
              <span>Astra is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-[#5A5A40]/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me about any concept..."
            className="w-full p-4 pr-14 rounded-full border border-[#5A5A40]/20 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/30 font-sans transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 w-10 h-10 rounded-full bg-[#5A5A40] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#4A4A30] transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center text-[#5A5A40]/40 uppercase tracking-widest font-sans">
          Guided by Astra • Powered by Gemini
        </p>
      </div>
    </div>
  );
}
