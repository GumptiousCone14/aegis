'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';

export default function AIAssistant({ threats }: {threats: any[]}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your AI Security Assistant. I can help you understand threats, analyze patterns, and answer questions about your security events. Try asking me about specific threats or general security advice!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "What are the most critical threats right now?",
    "Explain the APT28 threat in detail",
    "What should I do about DNS tunneling?",
    "How can I prevent ransomware attacks?",
    "Show me threats from Russia"
  ];

  const generateResponse = (query: string) => {
    // Simulate AI response based on query
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('critical') || lowerQuery.includes('most dangerous')) {
      return `Based on current threat analysis, you have **${threats.filter(t => t.severity === 'critical').length} critical threats** requiring immediate attention:

1. **C2 Communication** - APT28 infrastructure detected with 94% AI confidence
2. **Ransomware Activity** - File encryption behavior blocked (96% confidence)

**Immediate Actions:**
- Block all connections to identified C2 servers
- Quarantine affected files
- Review access logs for lateral movement`;
    }
    
    if (lowerQuery.includes('apt28') || lowerQuery.includes('apt 28')) {
      return `**APT28 (Fancy Bear) Analysis:**

APT28 is a sophisticated nation-state threat actor attributed to Russian military intelligence (GRU). 

**Current Detection:**
- C2 communication to malicious-server.tk
- Regular 15-second beacon intervals
- Encrypted payload with non-standard cipher

**Threat Level:** Critical
**AI Confidence:** 94%

**Known TTPs:**
- T1071.001 - Application Layer Protocol
- T1041 - Exfiltration Over C2 Channel
- T1027 - Obfuscated Files or Information

**Recommended Actions:**
1. Immediately block the IP: 185.220.101.45
2. Check for persistence mechanisms
3. Scan for additional compromised hosts
4. Review network logs for data exfiltration`;
    }
    
    if (lowerQuery.includes('dns tunneling')) {
      return `**DNS Tunneling Threat Analysis:**

DNS tunneling uses DNS queries to exfiltrate data or establish C2 communication, bypassing traditional security controls.

**Current Detection:**
- 500+ DNS queries per minute to update-service.xyz
- High entropy in subdomain names
- Unusual TXT record responses

**How It Works:**
Data is encoded in DNS queries and responses, using the DNS protocol as a covert channel.

**Mitigation Steps:**
1. Block the domain immediately
2. Monitor DNS traffic for abnormal patterns
3. Implement DNS query rate limiting
4. Use DNS security solutions (DNSSEC)
5. Whitelist legitimate DNS servers`;
    }
    
    if (lowerQuery.includes('ransomware') || lowerQuery.includes('prevent')) {
      return `**Ransomware Prevention Strategy:**

Your AI protection has already blocked ransomware attempts. Here's how to stay protected:

**Immediate Protections:**
✓ Real-time behavioral analysis (ACTIVE)
✓ File system monitoring (ACTIVE)
✓ Auto-quarantine (ENABLED)

**Best Practices:**
1. **Backup Strategy** - 3-2-1 rule (3 copies, 2 media types, 1 offsite)
2. **User Education** - Train on phishing awareness
3. **Patch Management** - Keep systems updated
4. **Network Segmentation** - Limit lateral movement
5. **Least Privilege** - Restrict user permissions

**Advanced Protection:**
- Enable controlled folder access
- Use application whitelisting
- Deploy email security gateways
- Implement network monitoring`;
    }
    
    if (lowerQuery.includes('russia') || lowerQuery.includes('origin')) {
      return `**Threats by Origin - Russia:**

Detected **2 threats** originating from Russian infrastructure:

1. **malicious-server.tk** (185.220.101.45)
   - Type: C2 Communication
   - Severity: Critical
   - Attribution: APT28 (Russian GRU)

**Analysis:**
These threats show hallmarks of nation-state operations with sophisticated evasion techniques.

**Geopolitical Context:**
APT28 has historically targeted government, military, and critical infrastructure sectors.

**Recommended Actions:**
- Add Russia-based IPs to blocklist
- Enable country-based filtering
- Increase monitoring of sensitive systems`;
    }
    
    // Default response
    return `I understand you're asking about "${query}". Here's what I can help with:

**Threat Analysis:**
- Detailed threat breakdowns
- Attribution and origin analysis
- Risk assessment

**Current Status:**
- ${threats.length} total threats detected
- ${threats.filter(t => t.severity === 'critical').length} critical priority

**Questions I can answer:**
- "What are the most critical threats?"
- "Explain [specific threat] in detail"
- "How to prevent [attack type]?"
- "Show threats from [country/source]"

Would you like to know more about any of these areas?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

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
            <p className="text-xs text-slate-400">Powered by advanced threat intelligence</p>
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
                  <ReactMarkdown 
                    className="prose prose-sm prose-invert max-w-none"
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
            placeholder="Ask about threats, security advice, or specific events..."
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
