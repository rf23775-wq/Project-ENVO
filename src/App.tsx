/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Megaphone, 
  Copy, 
  Check, 
  ChevronRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type TaskType = 'caption' | 'image' | 'video' | 'ads';

interface TaskConfig {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  systemInstruction: string;
  isSoon?: boolean;
}

const TASKS: Record<TaskType, TaskConfig> = {
  caption: {
    icon: <MessageSquare className="w-6 h-6" />,
    label: 'Gawan mo ako ng Caption',
    placeholder: 'Ano ang product o service mo? Kwento ka konti...',
    systemInstruction: `You are the B.O.S (Blueprint of Success) Social Media Specialist. 
    Your goal is to write high-converting, emotional, and persuasive social media captions.
    Target Audience: Filipinos (especially beginners and OFWs).
    Tone: Relatable, simple Tagalog or Taglish, direct, and action-oriented.
    Structure:
    1. Attention-grabbing Hook (Tagalog/Taglish)
    2. Relatable Story/Problem
    3. The B.O.S Solution
    4. Strong Call to Action (CTA)
    5. Relevant Emojis and Hashtags.
    Focus on driving buyers, not just likes.`,
  },
  image: {
    icon: <ImageIcon className="w-6 h-6" />,
    label: 'Gawan mo ako ng Image',
    placeholder: 'I-describe mo yung image na gusto mo (e.g. Isang pinay na nag-aaral mag online business)',
    systemInstruction: `You are the B.O.S (Blueprint of Success) Creative Director.
    Your goal is to generate high-quality, professional image prompts for AI generators.
    Input will be in Tagalog/Taglish. 
    Output should be a detailed English prompt optimized for DALL-E/Midjourney.
    Include styles like: "photorealistic", "high-end branding", "warm cinematic lighting", "clean minimal aesthetic".
    Ensure the vibe is premium and professional, matching the B.O.S brand.`,
  },
  video: {
    icon: <Video className="w-6 h-6" />,
    label: 'Gawan mo ako ng Video (soon)',
    placeholder: '',
    systemInstruction: '',
    isSoon: true,
  },
  ads: {
    icon: <Megaphone className="w-6 h-6" />,
    label: 'Gawan mo ako ng Ads (soon)',
    placeholder: '',
    systemInstruction: '',
    isSoon: true,
  }
};

export default function App() {
  const [task, setTask] = useState<TaskType | null>(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!task || !input.trim() || loading) return;

    setLoading(true);
    setOutput('');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: TASKS[task].systemInstruction,
          temperature: 0.7,
        },
      });
      
      setOutput(response.text || "Sorry, may error. Subukan mo ulit.");
    } catch (error) {
      console.error(error);
      setOutput("Medyo busy ang AI ngayon. Refresh mo lang.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (output && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  return (
    <div className="min-h-screen bg-black transition-colors duration-500 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="relative max-w-2xl mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen">
        
        {/* Header / Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <span className="text-black font-bold text-xl font-display italic">B</span>
            </div>
            <h1 className="font-display italic font-bold text-2xl gold-text tracking-tight">B.O.S</h1>
          </div>
          {task && (
            <button 
              onClick={() => { setTask(null); setInput(''); setOutput(''); }}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white/60" />
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!task ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-10 py-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
                  Pagpasok <span className="gold-text">Blueprint of Success</span>, 
                  <br />Alam mo na ang gagawin.
                </h2>
                <p className="text-gray-400 text-lg max-w-md">
                  Ang tool na ginawa para sa mga Pinoy na seryoso sa tagumpay. Simple lang, walang dashboard, direkta sa aksyon.
                </p>
              </div>

              <div className="grid gap-4">
                {(Object.keys(TASKS) as TaskType[]).map((key) => {
                  const t = TASKS[key];
                  return (
                    <motion.button
                      key={key}
                      whileHover={!t.isSoon ? { scale: 1.02, x: 10 } : {}}
                      whileTap={!t.isSoon ? { scale: 0.98 } : {}}
                      onClick={() => !t.isSoon && setTask(key)}
                      disabled={t.isSoon}
                      className={`
                        flex items-center justify-between p-6 rounded-2xl text-left transition-all
                        ${t.isSoon ? 'opacity-40 cursor-not-allowed bg-white/5 grayscale' : 'bg-white/5 gold-border hover:bg-white/10'}
                      `}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`p-3 rounded-lg ${t.isSoon ? 'bg-white/10' : 'bg-gold/10 text-gold'}`}>
                          {t.icon}
                        </div>
                        <span className={`text-xl font-medium ${t.isSoon ? 'text-white/40' : 'text-white'}`}>
                          {t.label}
                        </span>
                      </div>
                      {!t.isSoon && <ChevronRight className="w-6 h-6 text-gold" />}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="interaction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles className="w-5 h-5" />
                  <span className="uppercase text-xs font-bold tracking-widest">{TASKS[task].label}</span>
                </div>
                <h3 className="text-3xl font-display font-medium italic">Sabihin mo lang ang gusto mong mangyari...</h3>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <textarea
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={TASKS[task].placeholder}
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-gold/50 transition-all resize-none"
                  />
                  {!loading && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerate}
                      disabled={!input.trim()}
                      className={`
                        absolute bottom-4 right-4 p-4 rounded-xl font-bold flex items-center gap-2 transition-all
                        ${input.trim() ? 'gold-gradient text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-white/10 text-white/20'}
                      `}
                    >
                      Generate <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center p-12 space-y-4">
                    <Loader2 className="w-10 h-10 text-gold animate-spin" />
                    <p className="text-gold/60 font-medium">B.O.S is thinking... wait lang kapatid!</p>
                  </div>
                )}

                {output && !loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 rounded-3xl p-8 relative gold-border"
                  >
                    <div className="prose prose-invert max-w-none mb-6">
                      <div className="whitespace-pre-wrap text-white/90 leading-relaxed text-lg italic font-display">
                        {output}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Ready to copy!</span>
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gold transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            Copy Result
                          </>
                        )}
                      </button>
                    </div>
                    <div ref={scrollRef} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto py-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 uppercase tracking-widest text-center">
            <p>Created by AimGenz International</p>
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>Powered by ENVO</span>
            </div>
            <p>&copy; {new Date().getFullYear()} B.O.S</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

