import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingSanskrit } from '@/components/ui/FloatingSanskrit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Search, Volume2, Loader2, Sparkles } from 'lucide-react';

const ExplorePage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleExplore = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('sanskrit-oracle', {
        body: { word: query.trim() }
      });

      if (error) throw error;
      setResult(data.result);
    } catch (error: any) {
      toast({
        title: "The Oracle is meditating...",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const speakResult = () => {
    if (!result) return;
    const utterance = new SpeechSynthesisUtterance(result.replace(/[#*_]/g, ''));
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen vedic-gradient relative">
      <FloatingSanskrit count={10} />
      <Navbar />

      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-foreground mb-4">The Oracle</h1>
            <p className="font-mukta text-muted-foreground">Enter any word to discover its Sanskrit essence</p>
          </motion.div>

          <div className="talapatra-card p-8 mb-8">
            <div className="relative z-10 flex gap-4">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExplore()}
                placeholder="Enter a word (e.g., Peace, Knowledge, Love)"
                className="flex-1 bg-background/50"
              />
              <Button onClick={handleExplore} disabled={loading} className="saffron-glow">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="talapatra-card p-8">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-cinzel text-xl text-secondary">Oracle's Wisdom</h3>
                  <Button variant="ghost" size="icon" onClick={speakResult}>
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="prose prose-stone font-mukta text-foreground whitespace-pre-wrap">{result}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
