import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingSanskrit } from '@/components/ui/FloatingSanskrit';
import { Sun, Moon } from 'lucide-react';

const articles = [
  { id: 1, title: 'The Thirsty Crow', sanskrit: 'एकः कृष्णः काकः आसीत्। सः बहु तृषितः आसीत्। सः जलं अन्वेषयति स्म।', english: 'There was a black crow. He was very thirsty. He was searching for water.' },
  { id: 2, title: 'The Lion and Mouse', sanskrit: 'एकस्मिन् वने एकः सिंहः वसति स्म। एकदा सः निद्रां करोति स्म।', english: 'In a forest, there lived a lion. One day, he was sleeping.' },
  { id: 3, title: 'True Friendship', sanskrit: 'द्वौ मित्रे आस्ताम्। एकः धनवान् अन्यः निर्धनः।', english: 'There were two friends. One was rich, the other was poor.' },
];

const ArticlesPage = () => {
  const [showSanskrit, setShowSanskrit] = useState(true);
  const navigate = useNavigate();

  const handleArticleClick = (articleId: number) => {
    navigate(`/articles/${articleId}`);
  };

  return (
    <div className="min-h-screen vedic-gradient relative">
      <FloatingSanskrit count={8} />
      <Navbar />

      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-12">
            <h1 className="text-4xl font-cinzel font-bold text-foreground mb-4">भाषा सेतु</h1>
            <p className="font-mukta text-muted-foreground">Classic tales in Sanskrit & English</p>
          </motion.div>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowSanskrit(!showSanskrit)}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border"
            >
              {showSanskrit ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-secondary" />}
              <span className="font-mukta">{showSanskrit ? 'Sanskrit' : 'English'}</span>
            </button>
          </div>

          <div className="space-y-6">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="talapatra-card p-8 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="relative z-10">
                  <h3 className="font-cinzel text-xl text-secondary mb-4 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className={`font-mukta text-foreground leading-relaxed mb-4 ${
                    showSanskrit ? 'text-lg' : 'text-base'
                  }`}>
                    {showSanskrit ? article.sanskrit : article.english}
                  </p>
                  <div className="text-sm font-mukta text-primary hover:underline">
                    Read full story →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
