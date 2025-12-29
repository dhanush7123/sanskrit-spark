import { motion } from 'framer-motion';

const sanskritSymbols = ['ॐ', 'श्री', 'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'];

interface FloatingSanskritProps {
  count?: number;
}

export const FloatingSanskrit = ({ count = 15 }: FloatingSanskritProps) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: count }).map((_, i) => {
        const symbol = sanskritSymbols[Math.floor(Math.random() * sanskritSymbols.length)];
        const left = `${Math.random() * 100}%`;
        const top = `${Math.random() * 100}%`;
        const delay = Math.random() * 5;
        const duration = 8 + Math.random() * 10;
        const size = 2 + Math.random() * 3;

        return (
          <motion.span
            key={i}
            className="floating-sanskrit"
            style={{
              left,
              top,
              fontSize: `${size}rem`,
            }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 0.15, 0.1, 0.15, 0],
              y: [-20, 20, -10, 20, -20],
              rotate: [0, 5, -5, 3, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {symbol}
          </motion.span>
        );
      })}
    </div>
  );
};
