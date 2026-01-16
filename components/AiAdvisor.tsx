
import React, { useState } from 'react';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { generateWeddingAdvice } from '../services/geminiService';

export const AiAdvisor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const result = await generateWeddingAdvice(prompt);
      setResponse(result);
    } catch (err) {
      setError('Došlo je do greške. Molimo pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Koliko košta svadba za 150 gostiju u Beogradu?",
    "Predloži mi moderne pesme za prvi ples",
    "Koji su običaji za krštenje deteta?",
    "Ideje za dekoraciju zimskog venčanja"
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden" id="ai-savetnik">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start gap-12">
          
          {/* Text Side */}
          <div className="md:w-5/12 pt-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-bold text-blue-200 mb-6 backdrop-blur-sm">
              <Sparkles size={16} /> NOVO: AI Organizator
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Vaš lični <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">AI asistent</span> za proslave
            </h2>
            <p className="text-lg text-blue-100 mb-8 font-light leading-relaxed">
              Ne znate odakle da počnete? Pitajte našu veštačku inteligenciju za savet o budžetu, običajima, lokacijama ili idejama za dekoraciju. Besplatno i odmah dostupno.
            </p>
            
            <div className="hidden md:block">
              <p className="text-sm font-bold text-gray-400 uppercase mb-4">Popularna pitanja:</p>
              <div className="flex flex-wrap gap-3">
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(s)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-xs transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface Side */}
          <div className="md:w-7/12 w-full">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col border border-white/10">
              
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">SveZaProslavu AI</div>
                  <div className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                  </div>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 p-6 bg-slate-50 overflow-y-auto max-h-[400px]">
                
                {/* Intro Message */}
                <div className="flex gap-4 mb-6 animate-fade-in">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-700 text-sm border border-gray-100">
                    Zdravo! Ja sam vaš AI savetnik. Mogu vam pomoći oko budžeta, običaja ili pronalaska idealnog prostora. Šta vas zanima danas?
                  </div>
                </div>

                {/* Response Message */}
                {response && (
                  <div className="flex gap-4 mb-6 animate-fade-in">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm text-gray-700 text-sm border border-gray-100 prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: response.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br />') }} />
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex gap-4 mb-6">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-500 text-sm border border-gray-100 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Razmišljam...
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                   <div className="text-center text-red-500 text-sm my-4 bg-red-50 p-2 rounded-lg">{error}</div>
                )}

              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleAsk} className="relative">
                  <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Pitajte bilo šta (npr. Cena fotografa u Nišu...)"
                    className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 placeholder-gray-400"
                  />
                  <button 
                    type="submit" 
                    disabled={loading || !prompt.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
