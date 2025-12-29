import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { SparkParticles } from '@/components/ui/SparkParticles';
import { FloatingSanskrit } from '@/components/ui/FloatingSanskrit';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Scroll, 
  Brain, 
  BookOpen, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

const features = [
  {
    icon: Scroll,
    title: 'Timeline Journey',
    description: 'Explore the evolution of Sanskrit through ages',
    path: '/timeline',
  },
  {
    icon: Brain,
    title: 'Quiz Arena',
    description: 'Test your knowledge and earn Karma Points',
    path: '/quiz',
  },
  {
    icon: Sparkles,
    title: 'The Oracle',
    description: 'AI-powered Sanskrit word explorer',
    path: '/explore',
  },
  {
    icon: BookOpen,
    title: 'Sacred Texts',
    description: 'Read classical stories in Sanskrit & English',
    path: '/articles',
  },
];

const Index = () => {
  const { isAuthenticated } = useStore();

  return (
    <div className="min-h-screen vedic-gradient relative overflow-hidden">
      <SparkParticles />
      <FloatingSanskrit />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-foreground mb-6 text-shadow-vedic"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              संस्कृत
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl font-cinzel text-secondary mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              for the Curious Mind
            </motion.p>
            <motion.p
              className="text-lg font-mukta text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Embark on a journey through the mother of all languages. 
              Discover ancient wisdom, explore sacred texts, and unlock 
              the treasures of Vedic knowledge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={isAuthenticated ? '/timeline' : '/auth'}>
                <Button
                  size="lg"
                  className="font-mukta text-lg px-8 py-6 saffron-glow animate-pulse-glow"
                >
                  {isAuthenticated ? 'Continue Journey' : 'Begin Your Journey'}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-mukta text-lg px-8 py-6 gold-border"
                >
                  Explore The Oracle
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-20">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-cinzel text-center text-foreground mb-16"
          >
            Paths of Knowledge
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.path}>
                  <motion.div
                    className="talapatra-card p-6 h-full cursor-pointer"
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-cinzel text-xl text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="font-mukta text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sanskrit Quote Section */}
      <section className="py-20 px-4 relative z-20">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="talapatra-card p-10 text-center"
          >
            <div className="relative z-10">
              <p className="text-3xl md:text-4xl font-cinzel text-foreground mb-4">
                "वसुधैव कुटुम्बकम्"
              </p>
              <p className="font-mukta text-xl text-secondary italic mb-4">
                "Vasudhaiva Kutumbakam"
              </p>
              <p className="font-mukta text-muted-foreground">
                The world is one family — a timeless Sanskrit teaching 
                that reminds us of our universal connection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border relative z-20">
        <div className="container mx-auto text-center">
          <p className="font-mukta text-muted-foreground text-sm">
            © 2024 Sanskrit for Curious. Preserving the wisdom of ages.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
