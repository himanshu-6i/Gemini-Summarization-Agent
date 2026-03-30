import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        const errorMsg = data.message ? `${data.error}: ${data.message}` : (data.error || 'Something went wrong');
        setError(errorMsg);
      }
    } catch (err) {
      setError('Failed to connect to the agent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#1a1a1a] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-4"
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500">AI Agent v1.0</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Summarization <span className="italic font-serif">Agent</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Paste your long text below and let the Gemini-powered agent distill it into a concise summary.
          </p>
        </header>

        <main className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to summarize..."
                className="w-full h-48 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all placeholder:text-gray-400"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Summarize
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100"
            >
              {error}
            </motion.div>
          )}

          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                Summary Result
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            </motion.div>
          )}
        </main>

        <footer className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 uppercase tracking-widest font-medium">
          <div>Built with Gemini & ADK Pattern</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-gray-600 transition-colors">API Reference</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
