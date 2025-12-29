import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingSanskrit } from '@/components/ui/FloatingSanskrit';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Languages, Volume2, VolumeX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Article {
  id: number;
  title: string;
  sanskritTitle: string;
  sanskritStory: string;
  englishStory: string;
  summary: string;
  moral: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'The Thirsty Crow',
    sanskritTitle: 'तृषितः काकः',
    sanskritStory: `एकस्मिन् ग्रामे एकः कृष्णवर्णः काकः आसीत्। सः बहु तृषितः आसीत्। सः जलं अन्वेषयति स्म। किन्तु सर्वत्र जलं न प्राप्तम्।

अन्ते सः एकस्मिन् कूपे जलं दृष्टवान्। परन्तु जलं कूपस्य अधः आसीत्। काकः चिन्तयति स्म - "कथं जलं पिबामि?"

तदा सः एकां शिलां दृष्टवान्। सः शिलां गृहीत्वा कूपे पातितवान्। जलं ऊर्ध्वं आगतम्। काकः जलं पीत्वा तृप्तः अभवत्।

महत्त्वम्: बुद्ध्या कार्यं सिद्ध्यति।`,
    englishStory: `In a village, there lived a black crow. He was very thirsty. He searched for water everywhere. But he couldn't find water anywhere.

Finally, he saw water in a well. But the water was at the bottom of the well. The crow thought, "How can I drink the water?"

Then he saw a stone. He picked up the stone and dropped it into the well. The water level rose. The crow drank the water and became satisfied.

Moral: Intelligence accomplishes work.`,
    summary: 'A clever crow uses intelligence to reach water at the bottom of a well.',
    moral: 'Intelligence and wisdom can solve the most difficult problems.'
  },
  {
    id: 2,
    title: 'The Lion and Mouse',
    sanskritTitle: 'सिंहश्च मूषकश्च',
    sanskritStory: `एकस्मिन् वने एकः सिंहः वसति स्म। सः सर्वदा शक्तिमान् आसीत्। एकदा सः निद्रां करोति स्म। तदा एकः मूषकः सिंहस्य पुच्छे क्रीडति स्म।

सिंहः जागृतः अभवत्। सः क्रुद्धः मूषकं गृहीतवान्। मूषकः भीतः अभवत्। सः सिंहं प्रार्थयति स्म - "क्षमस्व मां महाराज! यदि मां मोक्षयसि तर्हि अहं ते उपकारं करिष्यामि।"

सिंहः हसित्वा मूषकं मोक्षितवान्। परेद्युः शिकारिणः सिंहं जाले बद्धवन्तः। सिंहः गर्जति स्म। मूषकः शब्दं श्रुत्वा आगतः। सः जालं कटितवान्। सिंहः मुक्तः अभवत्।

महत्त्वम्: न कदापि परं अवमानय। सर्वे कस्यचित् उपयोगिनः भवन्ति।`,
    englishStory: `In a forest, there lived a lion. He was always powerful. One day, he was sleeping. Then a mouse was playing with the lion's tail.

The lion woke up. He was angry and caught the mouse. The mouse was scared. He begged the lion, "Forgive me, Your Majesty! If you release me, I will help you."

The lion laughed and released the mouse. The next day, hunters trapped the lion in a net. The lion roared. The mouse heard the sound and came. He cut the net. The lion was freed.

Moral: Never underestimate anyone. Everyone can be useful to someone.`,
    summary: 'A mighty lion spares a tiny mouse, who later saves his life by cutting him free from a hunter\'s net.',
    moral: 'Never underestimate the power of kindness and never judge others by their size or appearance.'
  },
  {
    id: 3,
    title: 'True Friendship',
    sanskritTitle: 'सच्ची मैत्री',
    sanskritStory: `द्वौ मित्रौ आस्ताम् - एकः धनवान् अन्यः निर्धनः। धनवान् मित्रः सर्वदा धनं व्ययति स्म। निर्धनः मित्रः कठिनं कार्यं करोति स्म।

एकदा धनवान् मित्रः सर्वं धनं व्ययितवान्। सः निर्धनं मित्रं गतवान्। सः उक्तवान् - "मम सर्वं धनं नष्टम्। कृपया सहायं कुरु।"

निर्धनः मित्रः उक्तवान् - "आगच्छ। मम गृहे वस। अहं ते सहायं करिष्यामि।" सः स्वस्य अन्नं विभज्य धनवते दत्तवान्।

कालेन धनवान् मित्रः पुनः धनवान् अभवत्। सः निर्धनं मित्रं विस्मृतवान्। निर्धनः मित्रः रोगी अभवत्। सः धनवन्तं मित्रं गतवान्।

परन्तु धनवान् मित्रः द्वारं पिहितवान्। सः उक्तवान् - "अहं त्वां न जानामि। गच्छ।"

महत्त्वम्: सच्ची मैत्री परीक्षायां सिद्ध्यति। धनं न मैत्रीम् आकर्षति।`,
    englishStory: `There were two friends - one rich and one poor. The rich friend always spent money. The poor friend worked hard.

One day, the rich friend spent all his money. He went to his poor friend. He said, "All my money is gone. Please help me."

The poor friend said, "Come. Live in my house. I will help you." He shared his food with the rich friend.

With time, the rich friend became rich again. He forgot his poor friend. The poor friend became sick. He went to his rich friend.

But the rich friend closed the door. He said, "I don't know you. Go away."

Moral: True friendship is proven in testing times. Money does not attract true friendship.`,
    summary: 'A story of two friends where one helps the other in need, but their friendship is tested when fortunes reverse.',
    moral: 'True friendship endures through good times and bad, regardless of wealth or status.'
  }
];

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showTranslation, setShowTranslation] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const article = articles.find(a => a.id === parseInt(id || '0'));

  useEffect(() => {
    if (!article) {
      navigate('/articles');
    }
  }, [article, navigate]);

  // Load speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Speech voices loaded:', voices.length);
        }
      };

      loadVoices();
      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const translateWithGemini = async (text: string, targetLang: 'english' | 'sanskrit') => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Check if API key is configured
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      toast({
        title: "Translation Unavailable",
        description: "Gemini API key not configured. Using pre-written translation instead.",
        variant: "default",
      });
      // Fall back to pre-written translation
      setTranslatedText(article.englishStory);
      setShowTranslation(true);
      return;
    }

    setIsTranslating(true);
    try {
      // Using Gemini API for translation
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following ${targetLang === 'english' ? 'Sanskrit' : 'English'} text to ${targetLang}. Provide only the translation without any additional text or explanations. Maintain the poetic and narrative style:\n\n${text}`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const translation = data.candidates[0].content.parts[0].text.trim();

      setTranslatedText(translation);
      setShowTranslation(true);

      toast({
        title: "Translation Complete",
        description: "AI translation loaded successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Translation error:', error);

      // Fallback to pre-written translation
      setTranslatedText(article.englishStory);
      setShowTranslation(true);

      toast({
        title: "Translation Error",
        description: `AI translation failed: ${error.message}. Using pre-written translation instead.`,
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);

      // Use more compatible language codes
      if (lang === 'sanskrit') {
        // Try Hindi as fallback for Sanskrit since most browsers support it
        utterance.lang = 'hi-IN'; // Hindi - India
        utterance.rate = 0.7; // Slower for better pronunciation
      } else {
        utterance.lang = 'en-US'; // English - US
        utterance.rate = 0.8;
      }

      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "Unable to play audio. Please check your browser settings.",
          variant: "destructive",
        });
      };

      // Check if voices are available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (lang === 'sanskrit') {
          // Try to find a Hindi voice
          const hindiVoice = voices.find(voice => voice.lang.startsWith('hi'));
          if (hindiVoice) {
            utterance.voice = hindiVoice;
          }
        }
      }

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Speech Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen vedic-gradient relative">
      <FloatingSanskrit count={12} />
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/articles')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Button>
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-foreground mb-4">
              {article.title}
            </h1>
            <p className="text-xl font-cinzel text-secondary mb-4">
              {article.sanskritTitle}
            </p>
            <p className="font-mukta text-muted-foreground max-w-2xl mx-auto">
              {article.summary}
            </p>
          </motion.div>

          {/* Translation Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowTranslation(false);
                  setTranslatedText('');
                }}
                variant={!showTranslation ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Languages className="w-4 h-4" />
                Sanskrit
              </Button>
              <Button
                onClick={() => translateWithGemini(article.sanskritStory, 'english')}
                variant={showTranslation ? "default" : "outline"}
                disabled={isTranslating}
                className="flex items-center gap-2"
              >
                <Languages className="w-4 h-4" />
                {isTranslating ? 'Translating...' : 'English'}
              </Button>
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="talapatra-card p-8 md:p-12"
          >
            <div className="relative z-10">
              {/* Text-to-Speech Controls */}
              <div className="flex justify-end mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => speakText(
                    showTranslation ? translatedText || article.englishStory : article.sanskritStory,
                    showTranslation ? 'english' : 'sanskrit'
                  )}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Story Text */}
              <div className="mb-8">
                <h3 className="font-cinzel text-2xl text-secondary mb-6">
                  {showTranslation ? 'English Translation' : 'Sanskrit Story'}
                </h3>
                <div className={`font-mukta leading-relaxed whitespace-pre-line ${
                  showTranslation ? 'text-lg' : 'text-xl'
                }`}>
                  {showTranslation ? (translatedText || article.englishStory) : article.sanskritStory}
                </div>
              </div>

              {/* Moral */}
              <div className="pt-8 border-t border-border">
                <h4 className="font-cinzel text-xl text-secondary mb-4">Moral of the Story</h4>
                <p className="font-mukta text-foreground/90 text-lg italic">
                  {article.moral}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;