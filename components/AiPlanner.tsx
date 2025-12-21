import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { generateWeddingAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AiPlanner: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Zdravo! Ja sam vaš AI asistent. Mogu vam pomoći da procenite budžet, nađete salu ili osmislite dekoraciju.' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await generateWeddingAdvice(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="py-20 bg-airbnb-bg border-t border-gray-100">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Text Content */}
          <div className="lg:w-1/2 pt-4">
            <div className="text-primary font-bold text-3xl md:text-5xl mb-6 tracking-tight">
              Svadbeni<span className="text-airbnb-dark">Planer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-airbnb-dark mb-6">
              Sveobuhvatna pomoć u svakom trenutku.
            </h2>
            <p className="text-lg text-airbnb-gray mb-8 leading-relaxed">
              Uz našu AI tehnologiju, dobijate odgovore na pitanja o budžetu, tradiciji i organizaciji brže nego ikad. Kao da imate ličnog konsultanta dostupnog 24/7.
            </p>
            <button className="border border-airbnb-dark text-airbnb-dark hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
              Saznajte više
            </button>
          </div>

          {/* Chat Interface */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-2xl shadow-floating border border-gray-200 overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="font-bold text-lg text-airbnb-dark">Asistent</div>
                <Sparkles size={18} className="text-primary" />
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`
                      max-w-[85%] px-5 py-4 text-[15px] leading-relaxed rounded-2xl
                      ${msg.role === 'user' 
                        ? 'bg-airbnb-dark text-white rounded-br-sm' 
                        : 'bg-airbnb-bg text-airbnb-dark border border-gray-100 rounded-bl-sm'}
                    `}>
                      {msg.role === 'model' ? (
                         <div dangerouslySetInnerHTML={{ 
                           __html: msg.text
                             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                             .replace(/\n/g, '<br />')
                             .replace(/- /g, '• ') 
                         }} />
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-airbnb-bg px-4 py-3 rounded-2xl border border-gray-100">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Pošaljite poruku..."
                    className="w-full bg-airbnb-bg border border-gray-300 rounded-full pl-6 pr-12 py-3.5 outline-none focus:border-airbnb-dark focus:ring-1 focus:ring-airbnb-dark transition-all text-airbnb-dark font-medium"
                    disabled={loading}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:bg-gray-300 transition-all"
                  >
                    <Send size={16} fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};