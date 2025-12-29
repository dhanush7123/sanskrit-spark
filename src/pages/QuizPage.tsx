import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingSanskrit } from '@/components/ui/FloatingSanskrit';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Trophy, Flame, Clock, ArrowRight, CheckCircle, XCircle, Medal } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  sanskritTerm: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Which emotion does the concept of (शान्त रस / Shanta Rasa) represent?",
    sanskritTerm: "शान्त रस",
    options: ["Anger", "Peace & Serenity", "Love", "Fear"],
    correctAnswer: 1,
    explanation: "Shanta Rasa represents peace, tranquility, and spiritual serenity in Sanskrit aesthetics.",
  },
  {
    id: 2,
    question: "What does (धर्म / Dharma) fundamentally mean?",
    sanskritTerm: "धर्म",
    options: ["Religion", "Cosmic Order & Duty", "Prayer", "Meditation"],
    correctAnswer: 1,
    explanation: "Dharma encompasses cosmic law, moral order, duty, and righteousness.",
  },
  {
    id: 3,
    question: "The term (अहिंसा / Ahimsa) translates to?",
    sanskritTerm: "अहिंसा",
    options: ["War", "Victory", "Non-violence", "Strength"],
    correctAnswer: 2,
    explanation: "Ahimsa means non-violence and non-harm to any living being.",
  },
  {
    id: 4,
    question: "What is (योग / Yoga) derived from in Sanskrit?",
    sanskritTerm: "योग",
    options: ["Yuj (to unite)", "Yog (to fight)", "Yak (to speak)", "Yam (to control)"],
    correctAnswer: 0,
    explanation: "Yoga comes from 'Yuj' meaning to unite, yoke, or join - representing union of mind, body, and spirit.",
  },
  {
    id: 5,
    question: "The (गुरुकुल / Gurukul) system refers to?",
    sanskritTerm: "गुरुकुल",
    options: ["Temple worship", "Ancient education system", "Royal court", "Medical practice"],
    correctAnswer: 1,
    explanation: "Gurukul was the traditional residential schooling system where students lived with the Guru.",
  },
  {
    id: 6,
    question: "What does (नमस्ते / Namaste) literally mean?",
    sanskritTerm: "नमस्ते",
    options: ["Good morning", "I bow to you", "Be happy", "Welcome"],
    correctAnswer: 1,
    explanation: "Namaste comes from 'Namah' (bow) + 'Te' (to you), meaning 'I bow to the divine in you.'",
  },
  {
    id: 7,
    question: "(कर्म / Karma) in its original sense means?",
    sanskritTerm: "कर्म",
    options: ["Destiny", "Action", "Punishment", "Reward"],
    correctAnswer: 1,
    explanation: "Karma simply means 'action' - the law that every action has consequences.",
  },
  {
    id: 8,
    question: "The (वेद / Veda) literally translates to?",
    sanskritTerm: "वेद",
    options: ["Book", "Song", "Knowledge", "Story"],
    correctAnswer: 2,
    explanation: "Veda comes from 'Vid' meaning to know - the Vedas are 'knowledge' texts.",
  },
];

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Arjuna", score: 850 },
  { rank: 2, name: "Saraswati", score: 780 },
  { rank: 3, name: "Valmiki", score: 720 },
  { rank: 4, name: "Shakuntala", score: 650 },
  { rank: 5, name: "Bharat", score: 600 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <span className="text-2xl">🏆</span>;
    case 2:
      return <span className="text-2xl">🥈</span>;
    case 3:
      return <span className="text-2xl">🥉</span>;
    default:
      return <Medal className="w-5 h-5 text-muted-foreground" />;
  }
};

const QuizPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, addKarmaPoints, karmaPoints, user } = useStore();
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please enter the Gurukul to participate in the Quiz Arena.",
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && !showExplanation) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswer(-1);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, showExplanation]);

  const startQuiz = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      const points = 10 + timeBonus;
      setScore(score + points);
      addKarmaPoints(points);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setGameState('result');
      updateLeaderboard();
    }
  };

  const updateLeaderboard = () => {
    const userName = user?.name || 'Seeker';
    const newEntry: LeaderboardEntry = {
      rank: 0,
      name: userName,
      score: karmaPoints + score,
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
    
    setLeaderboard(updatedLeaderboard);
  };

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen vedic-gradient relative">
      <FloatingSanskrit count={8} />
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            {gameState === 'start' && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-foreground mb-6">
                  ज्ञान यज्ञ
                </h1>
                <p className="text-xl font-cinzel text-secondary mb-4">
                  Jnana Yajna - The Sacrifice of Knowledge
                </p>
                <p className="font-mukta text-muted-foreground max-w-xl mx-auto mb-10">
                  Test your understanding of Sanskrit concepts. 
                  Earn Karma Points for correct answers — the faster you answer, 
                  the more points you earn!
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="talapatra-card p-6 text-center">
                    <div className="relative z-10">
                      <Trophy className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h3 className="font-cinzel text-lg text-foreground">8 Questions</h3>
                      <p className="text-sm font-mukta text-muted-foreground">Challenge awaits</p>
                    </div>
                  </div>
                  <div className="talapatra-card p-6 text-center">
                    <div className="relative z-10">
                      <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h3 className="font-cinzel text-lg text-foreground">30 Seconds</h3>
                      <p className="text-sm font-mukta text-muted-foreground">Per question</p>
                    </div>
                  </div>
                  <div className="talapatra-card p-6 text-center">
                    <div className="relative z-10">
                      <Flame className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h3 className="font-cinzel text-lg text-foreground">Karma Points</h3>
                      <p className="text-sm font-mukta text-muted-foreground">Speed bonus!</p>
                    </div>
                  </div>
                </div>

                {isAuthenticated ? (
                  <Button
                    onClick={startQuiz}
                    size="lg"
                    className="font-mukta text-lg px-10 py-6 saffron-glow"
                  >
                    Begin the Yajna
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate('/auth')}
                    size="lg"
                    className="font-mukta text-lg px-10 py-6"
                  >
                    Login to Play
                  </Button>
                )}

                {/* Leaderboard */}
                <div className="mt-16">
                  <h2 className="text-2xl font-cinzel text-foreground mb-6">
                    कीर्ति स्तम्भ — Pillar of Victory
                  </h2>
                  <div className="talapatra-card p-6 max-w-md mx-auto">
                    <div className="relative z-10 space-y-3">
                      {leaderboard.map((entry) => (
                        <div
                          key={entry.rank}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            entry.rank <= 3 ? 'bg-primary/10' : 'bg-background/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getRankIcon(entry.rank)}
                            <span className="font-mukta text-foreground">{entry.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-primary" />
                            <span className="font-mukta font-semibold text-secondary">
                              {entry.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {gameState === 'playing' && question && (
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mukta text-muted-foreground">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-primary" />
                        <span className="font-mukta font-semibold text-secondary">{score}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${timeLeft <= 10 ? 'text-destructive' : ''}`}>
                        <Clock className="w-5 h-5" />
                        <span className="font-mukta font-semibold">{timeLeft}s</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: '100%' }}
                      animate={{ width: `${(timeLeft / 30) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <div className="talapatra-card p-8 mb-6">
                  <div className="relative z-10">
                    <span className="inline-block px-4 py-2 text-xl font-cinzel text-secondary bg-secondary/10 rounded-lg mb-6">
                      {question.sanskritTerm}
                    </span>
                    <h2 className="text-xl md:text-2xl font-mukta text-foreground leading-relaxed">
                      {question.question}
                    </h2>
                  </div>
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === question.correctAnswer;
                    const showResult = showExplanation;
                    
                    let optionClass = 'bg-card hover:bg-card/80 border-border';
                    if (showResult) {
                      if (isCorrect) {
                        optionClass = 'bg-green-500/20 border-green-500';
                      } else if (isSelected && !isCorrect) {
                        optionClass = 'bg-destructive/20 border-destructive';
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showExplanation}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${optionClass} ${
                          !showExplanation ? 'hover:border-primary cursor-pointer' : ''
                        }`}
                        whileHover={!showExplanation ? { scale: 1.02 } : {}}
                        whileTap={!showExplanation ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center gap-3">
                          {showResult && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                          )}
                          <span className="font-mukta text-foreground">{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="talapatra-card p-6 mb-6"
                    >
                      <div className="relative z-10">
                        <h3 className="font-cinzel text-lg text-secondary mb-2">Explanation</h3>
                        <p className="font-mukta text-muted-foreground">
                          {question.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showExplanation && (
                  <div className="text-center">
                    <Button
                      onClick={nextQuestion}
                      className="font-mukta px-8 saffron-glow"
                    >
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {gameState === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-foreground mb-6">
                  यज्ञ समाप्त
                </h1>
                <p className="text-xl font-cinzel text-secondary mb-8">
                  The Yajna is Complete
                </p>

                <div className="talapatra-card p-10 max-w-md mx-auto mb-10">
                  <div className="relative z-10">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                      <Flame className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-4xl font-cinzel font-bold text-foreground mb-2">
                      {score}
                    </p>
                    <p className="font-mukta text-secondary mb-6">Karma Points Earned</p>
                    
                    <div className="flex justify-center gap-4 mb-6">
                      {answers.map((correct, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            correct ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'
                          }`}
                        >
                          {correct ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                      ))}
                    </div>

                    <p className="font-mukta text-muted-foreground">
                      {answers.filter(a => a).length} of {answers.length} correct
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={startQuiz}
                    className="font-mukta saffron-glow"
                  >
                    Play Again
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="font-mukta gold-border"
                  >
                    Return Home
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
