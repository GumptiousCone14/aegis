'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { invoke } from '@tauri-apps/api/core';
import { useToast } from '@/hooks/use-toast';

interface Threat {
  id: number;
  name: string;
  severity: string;
  description?: string;
  timestamp?: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant'; content: string}>>([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your AI Security Assistant. I can help you understand threats, analyze patterns, and answer questions about your security events. Make sure your Gemini API key is configured in Settings for full AI capabilities."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [threats, setThreats] = useState<Threat[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load API key from settings
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
          const settings = await invoke<any>('get_settings');
          setApiKey(settings.geminiApiKey || '');
        }
      } catch (err) {
        console.error('Failed to load API key:', err);
      }
    };
    loadApiKey();
  }, []);

  // Load recent threats for context
  useEffect(() => {
    const loadThreats = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
          const threatsRes = await invoke<any[]>('get_recent_threats');
          // Simplify threat list for context
          const simplified = threatsRes.map((t, idx) => ({
            id: idx,
            name: t.threat_type,
            severity: t.confidence > 0.8 ? 'critical' : 'medium',
            description: `AI confidence: ${(t.confidence * 100).toFixed(0)}%`,
            timestamp: t.timestamp
          }));
          setThreats(simplified);
        }
      } catch (err) {
        console.error('Failed to load threats for AI context:', err);
      }
    };
    loadThreats();
  }, []);

  const buildContext = () => {
    if (threats.length === 0) return "No recent threats detected.";
    const threatList = threats.map(t => `- ${t.name} (${t.severity}): ${t.description}`).join('\n');
    return `Current recent threats:\n${threatList}`;
  };

  const generateResponse = async (query: string) => {
    if (!apiKey) {
      return "⚠️ The AI Assistant is not configured. Please add your Gemini API key in **Settings > AI Configuration** to enable AI-powered responses.";
    }

    const context = buildContext();
    const fullPrompt = `You are a security assistant for the Aegis antivirus dashboard. Answer the user's question based on the current threat context. Be concise but helpful.

${context}

User question: ${query}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }]
          })
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'API request failed');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
    } catch (error: any) {
      console.error('Gemini API error:', error);
      return `❌ Error contacting AI service: ${error.message}. Please check your API key and internet connection.`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input);
      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  const suggestedQuestions = [
    "What are the most critical threats right now?",
    "Explain the APT28 threat in detail",
    "What should I do about DNS tunneling?",
    "How can I prevent ransomware attacks?",
    "Show me threats from Russia"
  ];

  return (
    <div className="flex flex-col h-[600px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Security Assistant</h3>
            <p className="text-xs text-slate-400">
              {apiKey ? 'Powered by Google Gemini' : 'API key required'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-200'
              }`}>
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 text-xs font-mono">{children}</code>
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-800 rounded-2xl p-4">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(q)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={apiKey ? "Ask about threats, security advice, or specific events..." : "Configure API key in Settings to chat..."}
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            disabled={!apiKey}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading || !apiKey}
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!apiKey && (
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
            <Key className="w-3 h-3" />
            Gemini API key not set. Go to Settings > AI Configuration.
          </p>
        )}
      </div>
    </div>
  );
}
