import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingSanskrit } from '@/components/ui/FloatingSanskrit';

interface TimelineEvent {
  id: number;
  era: string;
  title: string;
  sanskritTitle: string;
  period: string;
  description: string;
  significance: string;
  image: string;
}

// Use correct image base for local dev and GitHub Pages
const IMAGE_BASE =
  import.meta.env.DEV ? "/images/" : "/sanskrit-spark/images/";

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    era: 'Vedic Era',
    title: 'The Birth of Sanskrit',
    sanskritTitle: 'वैदिक संस्कृतम्',
    period: '1500 - 500 BCE',
    description: 'Sanskrit emerges as the language of the Vedas, the oldest scriptures of Hinduism. The Rigveda, composed in this period, contains over 10,000 verses.',
    significance: 'Foundation of Indo-European linguistics and spiritual literature.',
    image: `${IMAGE_BASE}vedic-era.png`,
  },
  {
    id: 2,
    era: 'Classical Age',
    title: 'Panini & The Grammar',
    sanskritTitle: 'पाणिनीय व्याकरणम्',
    period: '6th - 4th Century BCE',
    description: 'Panini creates the Ashtadhyayi, containing 3,959 sutras that define Sanskrit grammar with mathematical precision.',
    significance: 'First formal grammar in human history, influencing modern linguistics.',
    image: `${IMAGE_BASE}panini-grammar.png`,
  },
  {
    id: 3,
    era: 'Golden Age',
    title: 'The Age of Kalidasa',
    sanskritTitle: 'कालिदास युगम्',
    period: '4th - 5th Century CE',
    description: 'Kalidasa writes masterpieces like Shakuntala and Meghaduta. Sanskrit reaches its artistic zenith.',
    significance: 'Peak of Sanskrit poetry, drama, and artistic expression.',
    image: `${IMAGE_BASE}kalidasa-age.png`,
  },
  {
    id: 4,
    era: 'Medieval Period',
    title: 'Philosophical Flourishing',
    sanskritTitle: 'दर्शन विकासः',
    period: '8th - 12th Century CE',
    description: 'Scholars like Adi Shankaracharya compose profound philosophical texts in Sanskrit, establishing Advaita Vedanta.',
    significance: 'Development of complex philosophical systems and commentaries.',
    image: `${IMAGE_BASE}philosophical-flourishing.png`,
  },
  {
    id: 5,
    era: 'Modern Revival',
    title: 'Sanskrit Renaissance',
    sanskritTitle: 'संस्कृत पुनर्जागरणम्',
    period: '19th Century - Present',
    description: 'Western scholars discover Sanskrit\'s connection to European languages. Digital preservation and AI translation efforts emerge.',
    significance: 'Global recognition and technological preservation of ancient wisdom.',
    image: `${IMAGE_BASE}sanskrit-renaissance.png`,
  },
];

const TimelineNode = ({ 
  event, 
  index 
}: { 
  event: TimelineEvent; 
  index: number;
}) => {
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`flex items-center gap-8 mb-20 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Image Section */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, scale: 0.8, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
          <motion.img
            src={event.image}
            alt={event.title}
            className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <motion.div
            className="absolute bottom-4 left-4 right-4 text-white"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="font-cinzel text-lg font-semibold mb-1">{event.era}</h4>
            <p className="font-mukta text-sm opacity-90">{event.period}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Center Node */}
      <div className="relative z-20 flex-shrink-0">
        <motion.div
          className="w-8 h-8 rounded-full bg-primary border-4 border-card flex items-center justify-center saffron-glow"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
        </motion.div>
      </div>

      {/* Card */}
      <div className="flex-1">
        <motion.div
          className="talapatra-card p-6 md:p-8"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 text-xs font-mukta font-semibold text-primary bg-primary/10 rounded-full mb-4">
              {event.era}
            </span>
            <h3 className="text-2xl md:text-3xl font-cinzel text-foreground mb-2">
              {event.title}
            </h3>
            <p className="text-lg font-cinzel text-secondary mb-3">
              {event.sanskritTitle}
            </p>
            <p className="text-sm font-mukta text-muted-foreground mb-4">
              {event.period}
            </p>
            <p className="font-mukta text-foreground/80 mb-4 leading-relaxed">
              {event.description}
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-mukta">
                <span className="text-secondary font-semibold">Significance: </span>
                <span className="text-muted-foreground">{event.significance}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const TimelinePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen vedic-gradient relative" ref={containerRef}>
      <FloatingSanskrit count={12} />
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-cinzel font-bold text-foreground mb-6"
          >
            The Journey Through Time
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-mukta text-muted-foreground max-w-2xl mx-auto"
          >
            Trace the evolution of Sanskrit from its Vedic origins 
            to its modern-day renaissance.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 px-4 relative">
        <div className="container mx-auto max-w-5xl relative">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2 hidden md:block">
            <motion.div
              className="w-full bg-gradient-to-b from-primary to-secondary"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline Events */}
          {timelineEvents.map((event, index) => (
            <TimelineNode key={event.id} event={event} index={index} />
          ))}

          {/* End Marker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-10"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/20 border-4 border-secondary mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl">ॐ</span>
            </div>
            <p className="font-cinzel text-xl text-secondary">
              The Journey Continues...
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="font-mukta text-muted-foreground text-sm">
            © 2024 Sanskrit for Curious
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TimelinePage;
