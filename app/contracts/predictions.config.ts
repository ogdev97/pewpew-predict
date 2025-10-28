// Prediction Markets Configuration
// Each matchweek contains its own set of prediction markets

export interface PredictionMarket {
  id: number;
  question: string;
  image: string;
  yesOdds: string;
  noOdds: string;
}

export interface MatchweekConfig {
  matchweek: number;
  markets: PredictionMarket[];
}

// Configuration for all matchweeks
export const MATCHWEEKS_CONFIG: MatchweekConfig[] = [
  // Matchweek 1
  {
    matchweek: 1,
    markets: [
      {
        id: 1,
        question: 'Will Manchester City win the Premier League 2025/26?',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=1200&fit=crop',
        yesOdds: '58%',
        noOdds: '42%',
      },
      {
        id: 2,
        question: 'Will Real Madrid reach UCL Final 2025/26?',
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=1200&fit=crop',
        yesOdds: '65%',
        noOdds: '35%',
      },
      {
        id: 3,
        question: 'Will Haaland score 40+ goals this season?',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop',
        yesOdds: '52%',
        noOdds: '48%',
      },
      {
        id: 4,
        question: 'Will Arsenal finish in Top 2 of Premier League?',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop',
        yesOdds: '71%',
        noOdds: '29%',
      },
    ],
  },
  // Matchweek 2
  {
    matchweek: 2,
    markets: [
      {
        id: 5,
        question: 'Will Liverpool win against Chelsea this week?',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=1200&fit=crop',
        yesOdds: '62%',
        noOdds: '38%',
      },
      {
        id: 6,
        question: 'Will PSG advance in Champions League knockout?',
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=1200&fit=crop',
        yesOdds: '55%',
        noOdds: '45%',
      },
      {
        id: 7,
        question: 'Will Mbappe score a hat-trick this matchweek?',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop',
        yesOdds: '18%',
        noOdds: '82%',
      },
      {
        id: 8,
        question: 'Will Barcelona keep a clean sheet vs Atletico?',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop',
        yesOdds: '44%',
        noOdds: '56%',
      },
    ],
  },
  // Matchweek 3
  {
    matchweek: 3,
    markets: [
      {
        id: 9,
        question: 'Will Bayern Munich win the Bundesliga title?',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=1200&fit=crop',
        yesOdds: '73%',
        noOdds: '27%',
      },
      {
        id: 10,
        question: 'Will Inter Milan defend Serie A title?',
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=1200&fit=crop',
        yesOdds: '59%',
        noOdds: '41%',
      },
      {
        id: 11,
        question: 'Will Tottenham finish in Top 4?',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop',
        yesOdds: '48%',
        noOdds: '52%',
      },
      {
        id: 12,
        question: 'Will there be 5+ goals in Man Utd vs Arsenal?',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop',
        yesOdds: '22%',
        noOdds: '78%',
      },
    ],
  },
  // Matchweek 4
  {
    matchweek: 4,
    markets: [
      {
        id: 13,
        question: 'Will Juventus qualify for Champions League?',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=1200&fit=crop',
        yesOdds: '67%',
        noOdds: '33%',
      },
      {
        id: 14,
        question: 'Will Napoli win Serie A this season?',
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=1200&fit=crop',
        yesOdds: '41%',
        noOdds: '59%',
      },
      {
        id: 15,
        question: 'Will Bellingham win Ballon d\'Or 2026?',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop',
        yesOdds: '35%',
        noOdds: '65%',
      },
      {
        id: 16,
        question: 'Will Newcastle win a trophy this season?',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop',
        yesOdds: '28%',
        noOdds: '72%',
      },
    ],
  },
  // Matchweek 5
  {
    matchweek: 5,
    markets: [
      {
        id: 17,
        question: 'Will England win the World Cup 2026?',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=1200&fit=crop',
        yesOdds: '14%',
        noOdds: '86%',
      },
      {
        id: 18,
        question: 'Will Ronaldo score 30+ goals this season?',
        image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&h=1200&fit=crop',
        yesOdds: '39%',
        noOdds: '61%',
      },
      {
        id: 19,
        question: 'Will AC Milan win the Coppa Italia?',
        image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=1200&fit=crop',
        yesOdds: '31%',
        noOdds: '69%',
      },
      {
        id: 20,
        question: 'Will Dortmund reach UCL semi-finals?',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop',
        yesOdds: '43%',
        noOdds: '57%',
      },
    ],
  },
];

// Helper function to get markets for a specific matchweek
export const getMarketsForMatchweek = (matchweek: number): PredictionMarket[] => {
  const config = MATCHWEEKS_CONFIG.find(w => w.matchweek === matchweek);
  return config?.markets || [];
};

// Helper function to get total number of matchweeks
export const getTotalMatchweeks = (): number => {
  return MATCHWEEKS_CONFIG.length;
};

