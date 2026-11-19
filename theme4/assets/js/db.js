/**
 * Theme 4: Dark Minimalist / E-Sports Pro
 * Central Mock Database & State Management (LocalStorage DB)
 * Enhanced with pro ELO ratings, clan tags, match history, and tournament brackets.
 */

const DB_KEYS = {
  GAMES: 'wap_theme4_games',
  TOURNAMENTS: 'wap_theme4_tournaments',
  PLAYERS: 'wap_theme4_players',
  SUBSCRIPTIONS: 'wap_theme4_subscriptions',
  REVIEWS: 'wap_theme4_reviews',
  SMS_LOGS: 'wap_theme4_sms_logs',
  CURRENT_USER: 'wap_theme4_current_user',
  SETTINGS: 'wap_theme4_settings'
};

// Default seed games
const DEFAULT_GAMES = [
  {
    id: 'game-1',
    title: 'Space Blaster 2D',
    category: 'Action',
    type: 'Single Player',
    description: 'Precision shooter. Eliminate hostile drones and survive asteroid waves in deep space.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    engineKey: 'space-blaster',
    isNew: true,
    playsCount: 4210,
    rules: [
      'Use Arrow Keys or A/D to steer (Touch left/right on mobile).',
      'Press Spacebar or Fire button to shoot plasma projectiles.',
      'Enemy fighter destroyed = +10 PTS. Asteroids = +20 PTS.',
      '3 Lives per session. Collision depletes 1 life.',
      'Official leaderboard records your absolute highest score.'
    ]
  },
  {
    id: 'game-2',
    title: 'Neon Flappy 2D',
    category: 'Arcade',
    type: 'Single Player',
    description: 'High-precision altitude control through narrow cybernetic pylons.',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
    engineKey: 'flappy-bird',
    isNew: true,
    playsCount: 5890,
    rules: [
      'Tap Screen or Press Spacebar for vertical thrust.',
      'Avoid high-voltage neon barriers top and bottom.',
      'Each gate cleared = +1 PTS.',
      'Sudden death mode: Single collision triggers Game Over.'
    ]
  },
  {
    id: 'game-3',
    title: 'Retro Snake Arena',
    category: 'Classic',
    type: 'Multiplayer',
    description: 'Tactical spatial growth simulator. Maximize tail length and dominate the grid.',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60',
    engineKey: 'retro-snake',
    isNew: false,
    playsCount: 8400,
    rules: [
      'Use Arrow keys, Swipe or On-screen D-Pad to steer.',
      'Consume quantum nodes to grow and earn +15 PTS.',
      'Colliding with arena boundary or own tail terminates run.',
      'Snake velocity progressively increases.'
    ]
  },
  {
    id: 'game-4',
    title: 'Cyber Pong Clash',
    category: 'Multiplayer',
    type: 'Multiplayer',
    description: 'High-speed kinetic paddle duel. Reflexes and spin control determine victory.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60',
    engineKey: 'cyber-pong',
    isNew: true,
    playsCount: 3120,
    rules: [
      'Control paddle vertically with Arrow Keys or Finger Drag.',
      'Deflect the cyber orb past the opponent goal line.',
      'First to reach target goals secures the match victory.',
      'Ball speed increases with successive rallies.'
    ]
  }
];

// Default Pro Tournaments
const DEFAULT_TOURNAMENTS = [
  {
    id: 'tour-1',
    title: 'Pro Circuit Season 4: Space Blaster',
    gameId: 'game-1',
    gameTitle: 'Space Blaster 2D',
    prizePool: '5,000 BDT',
    entryFee: 'Active Pass',
    status: 'Live', // 'Live' | 'Upcoming' | 'Ended'
    startDate: '2026-11-18',
    endDate: '2026-11-25',
    participantsCount: 384,
    tier: 'Tier 1 Pro',
    leaderboard: [
      { rank: 1, name: 'Sabbir Ahmed', clan: 'TITAN', phone: '01711***111', score: 3840, prize: '2,500 BDT', elo: 2480 },
      { rank: 2, name: 'Tanvir Hossain', clan: 'VIPER', phone: '01822***222', score: 3410, prize: '1,500 BDT', elo: 2390 },
      { rank: 3, name: 'Shakil Khan', clan: 'PHANTOM', phone: '01933***333', score: 2980, prize: '1,000 BDT', elo: 2240 },
      { rank: 4, name: 'Nayeem Islam', clan: 'APEX', phone: '01644***444', score: 2650, prize: '-', elo: 2110 },
      { rank: 5, name: 'Rahim Pro', clan: 'TITAN', phone: '01755***555', score: 2420, prize: '-', elo: 2050 }
    ]
  },
  {
    id: 'tour-2',
    title: 'Masters Invitational: Neon Flappy',
    gameId: 'game-2',
    gameTitle: 'Neon Flappy 2D',
    prizePool: '3,000 BDT',
    entryFee: 'Active Pass',
    status: 'Live',
    startDate: '2026-11-19',
    endDate: '2026-11-22',
    participantsCount: 290,
    tier: 'Challenger',
    leaderboard: [
      { rank: 1, name: 'Farhan Fahim', clan: 'APEX', phone: '01799***888', score: 142, prize: '1,800 BDT', elo: 2340 },
      { rank: 2, name: 'Rayhan Shorif', clan: 'TITAN', phone: '01700***000', score: 128, prize: '800 BDT', elo: 2280 },
      { rank: 3, name: 'Mahfuz Rahman', clan: 'VIPER', phone: '01511***999', score: 110, prize: '400 BDT', elo: 2150 }
    ]
  },
  {
    id: 'tour-3',
    title: 'Tactical Clash: Retro Snake Arena',
    gameId: 'game-3',
    gameTitle: 'Retro Snake Arena',
    prizePool: '2,000 BDT',
    entryFee: 'Active Pass',
    status: 'Upcoming',
    startDate: '2026-11-23',
    endDate: '2026-11-28',
    participantsCount: 165,
    tier: 'Open Cup',
    leaderboard: []
  }
];

// Default Pro Players with Clans & ELO Ratings
const DEFAULT_PLAYERS = [
  {
    id: 'ply-1',
    name: 'Sabbir Ahmed',
    clan: 'TITAN',
    phone: '01711000111',
    pin: '1234',
    tokens: 320,
    referralCode: 'TITAN_SABBIR',
    referredBy: null,
    referralsCount: 6,
    eloRating: 2480,
    tier: 'Grandmaster',
    winRate: 78.4,
    matchesPlayed: 214,
    tournamentsWon: 11,
    scores: { 'game-1': 3840, 'game-2': 118, 'game-3': 2100, 'game-4': 48 },
    activeSubscription: {
      planName: '5 Days Pro Pass',
      expiresAt: '2026-12-05T23:59:59Z',
      active: true
    },
    isBanned: false,
    createdAt: '2026-10-15'
  },
  {
    id: 'ply-2',
    name: 'Tanvir Hossain',
    clan: 'VIPER',
    phone: '01822000222',
    pin: '1234',
    tokens: 180,
    referralCode: 'VIPER_TANVIR',
    referredBy: 'TITAN_SABBIR',
    referralsCount: 3,
    eloRating: 2390,
    tier: 'Master',
    winRate: 71.2,
    matchesPlayed: 180,
    tournamentsWon: 7,
    scores: { 'game-1': 3410, 'game-2': 94, 'game-3': 1850, 'game-4': 40 },
    activeSubscription: {
      planName: '2 Days Pass',
      expiresAt: '2026-11-22T23:59:59Z',
      active: true
    },
    isBanned: false,
    createdAt: '2026-11-01'
  },
  {
    id: 'ply-3',
    name: 'Rayhan Shorif (You)',
    clan: 'TITAN',
    phone: '01700000000',
    pin: '1234',
    tokens: 150,
    referralCode: 'RAYHAN_PRO',
    referredBy: null,
    referralsCount: 4,
    eloRating: 2280,
    tier: 'Master',
    winRate: 69.5,
    matchesPlayed: 128,
    tournamentsWon: 5,
    scores: { 'game-1': 2890, 'game-2': 128, 'game-3': 1620, 'game-4': 36 },
    activeSubscription: {
      planName: '1 Day Daily Pass',
      expiresAt: '2026-11-21T23:59:59Z',
      active: true
    },
    isBanned: false,
    createdAt: '2026-11-10'
  },
  {
    id: 'ply-4',
    name: 'Abir Banned User',
    clan: 'RECKLESS',
    phone: '01999999999',
    pin: '1234',
    tokens: 0,
    referralCode: 'ABIR_BAN',
    referredBy: null,
    referralsCount: 0,
    eloRating: 1420,
    tier: 'Silver',
    winRate: 35.0,
    matchesPlayed: 45,
    tournamentsWon: 0,
    scores: { 'game-1': 890 },
    activeSubscription: null,
    isBanned: true,
    createdAt: '2026-11-05'
  }
];

// Subscription Plans
const DEFAULT_PLANS = [
  {
    id: 'plan-1',
    name: '1 Day Daily Pass',
    price: 3,
    currency: 'BDT',
    days: 1,
    tokensRequired: 30,
    badge: 'Starter',
    features: ['All 2D Games Access', 'Daily Tournament Eligibility', 'Instant bKash Checkout']
  },
  {
    id: 'plan-2',
    name: '2 Days Pass',
    price: 5,
    currency: 'BDT',
    days: 2,
    tokensRequired: 50,
    badge: 'Popular',
    features: ['48 Hours Unlimited Play', 'Cash Prize Tournaments', 'Leaderboard Score Locking']
  },
  {
    id: 'plan-3',
    name: '5 Days Pro Pass',
    price: 10,
    currency: 'BDT',
    days: 5,
    tokensRequired: 90,
    badge: 'Pro Tier',
    features: ['120 Hours Full Access', 'All Tournament Circuits', 'Priority ELO Matchmaking', 'WhatsApp Support']
  }
];

// Default Reviews
const DEFAULT_REVIEWS = [
  { id: 'rev-1', gameId: 'game-1', playerName: 'Sabbir Ahmed [TITAN]', rating: 5, comment: 'Super crisp controls, zero input lag on mobile. Love the laser sound FX!', date: '2026-11-18' },
  { id: 'rev-2', gameId: 'game-2', playerName: 'Tanvir Hossain [VIPER]', rating: 4, comment: 'Challenging hitboxes. Highly competitive tournament setup.', date: '2026-11-19' }
];

// Default SMS logs
const DEFAULT_SMS_LOGS = [
  { id: 'sms-1', recipient: 'All Active Players (384)', message: 'Flash Tournament Alert: 5,000 BDT Prize Pool live on Space Blaster 2D! Climb the ranks now!', date: '2026-11-19 11:30' },
  { id: 'sms-2', recipient: 'New Signups', message: 'Welcome to WAP Games E-Sports Pro! 50 Free Tokens credited to your wallet. Exchange for Daily Pass.', date: '2026-11-18 16:00' }
];

// Central WapDB Object
const WapDB = {
  init() {
    if (!localStorage.getItem(DB_KEYS.GAMES)) {
      localStorage.setItem(DB_KEYS.GAMES, JSON.stringify(DEFAULT_GAMES));
    }
    if (!localStorage.getItem(DB_KEYS.TOURNAMENTS)) {
      localStorage.setItem(DB_KEYS.TOURNAMENTS, JSON.stringify(DEFAULT_TOURNAMENTS));
    }
    if (!localStorage.getItem(DB_KEYS.PLAYERS)) {
      localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(DEFAULT_PLAYERS));
    }
    if (!localStorage.getItem(DB_KEYS.REVIEWS)) {
      localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    }
    if (!localStorage.getItem(DB_KEYS.SMS_LOGS)) {
      localStorage.setItem(DB_KEYS.SMS_LOGS, JSON.stringify(DEFAULT_SMS_LOGS));
    }
    // Set default demo logged-in user if none exists
    if (!localStorage.getItem(DB_KEYS.CURRENT_USER)) {
      const players = this.getPlayers();
      const demoUser = players.find(p => p.phone === '01700000000') || players[0];
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(demoUser));
    }
  },

  getGames() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.GAMES)) || DEFAULT_GAMES;
    } catch (e) {
      return DEFAULT_GAMES;
    }
  },

  getGameById(id) {
    const games = this.getGames();
    return games.find(g => g.id === id);
  },

  saveGame(game) {
    const games = this.getGames();
    const index = games.findIndex(g => g.id === game.id);
    if (index >= 0) {
      games[index] = { ...games[index], ...game };
    } else {
      game.id = 'game-' + Date.now();
      game.playsCount = 0;
      games.push(game);
    }
    localStorage.setItem(DB_KEYS.GAMES, JSON.stringify(games));
    return game;
  },

  deleteGame(id) {
    let games = this.getGames();
    games = games.filter(g => g.id !== id);
    localStorage.setItem(DB_KEYS.GAMES, JSON.stringify(games));
    return true;
  },

  getTournaments() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.TOURNAMENTS)) || DEFAULT_TOURNAMENTS;
    } catch (e) {
      return DEFAULT_TOURNAMENTS;
    }
  },

  getTournamentById(id) {
    const list = this.getTournaments();
    return list.find(t => t.id === id);
  },

  saveTournament(tournament) {
    const list = this.getTournaments();
    const index = list.findIndex(t => t.id === tournament.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...tournament };
    } else {
      tournament.id = 'tour-' + Date.now();
      tournament.participantsCount = 0;
      tournament.leaderboard = [];
      list.push(tournament);
    }
    localStorage.setItem(DB_KEYS.TOURNAMENTS, JSON.stringify(list));
    return tournament;
  },

  deleteTournament(id) {
    let list = this.getTournaments();
    list = list.filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TOURNAMENTS, JSON.stringify(list));
    return true;
  },

  getPlayers() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.PLAYERS)) || DEFAULT_PLAYERS;
    } catch (e) {
      return DEFAULT_PLAYERS;
    }
  },

  getPlayerById(id) {
    const players = this.getPlayers();
    return players.find(p => p.id === id);
  },

  toggleBanPlayer(id) {
    const players = this.getPlayers();
    const player = players.find(p => p.id === id);
    if (player) {
      player.isBanned = !player.isBanned;
      localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(players));
      const curr = this.getCurrentUser();
      if (curr && curr.id === id) {
        curr.isBanned = player.isBanned;
        localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(curr));
      }
      return player.isBanned;
    }
    return false;
  },

  getCurrentUser() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER));
    } catch (e) {
      return null;
    }
  },

  login(phone, pin) {
    const players = this.getPlayers();
    const user = players.find(p => p.phone === phone && p.pin === pin);
    if (!user) {
      return { success: false, message: 'Invalid phone or PIN.' };
    }
    if (user.isBanned) {
      return { success: false, message: 'Your account has been suspended by the administrator.' };
    }
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, user };
  },

  signup(name, phone, pin, referralCode, clan = 'ROOKIE') {
    const players = this.getPlayers();
    if (players.find(p => p.phone === phone)) {
      return { success: false, message: 'Phone number already registered. Please login.' };
    }
    let bonusTokens = 50; // default 50 signup tokens
    let referrer = null;
    if (referralCode) {
      referrer = players.find(p => p.referralCode === referralCode.trim());
      if (referrer) {
        referrer.tokens = (referrer.tokens || 0) + 25;
        referrer.referralsCount = (referrer.referralsCount || 0) + 1;
        bonusTokens += 15;
      }
    }
    const newUser = {
      id: 'ply-' + Date.now(),
      name,
      clan: clan.trim() || 'ROOKIE',
      phone,
      pin,
      tokens: bonusTokens,
      referralCode: name.toUpperCase().replace(/\s+/g, '') + '_' + Math.floor(100 + Math.random() * 900),
      referredBy: referrer ? referrer.referralCode : null,
      referralsCount: 0,
      eloRating: 1500,
      tier: 'Challenger',
      winRate: 0,
      matchesPlayed: 0,
      tournamentsWon: 0,
      scores: {},
      activeSubscription: null,
      isBanned: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    players.push(newUser);
    localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(players));
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return { success: true, user: newUser, bonusTokens };
  },

  logout() {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  },

  updateScore(gameId, score) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const players = this.getPlayers();
    const pIndex = players.findIndex(p => p.id === user.id);
    if (pIndex >= 0) {
      if (!players[pIndex].scores) players[pIndex].scores = {};
      const currentHigh = players[pIndex].scores[gameId] || 0;
      if (score > currentHigh) {
        players[pIndex].scores[gameId] = score;
        user.scores[gameId] = score;
      }
      players[pIndex].matchesPlayed = (players[pIndex].matchesPlayed || 0) + 1;
      // Slight ELO bump on high score
      if (score > 100) {
        players[pIndex].eloRating = (players[pIndex].eloRating || 1500) + Math.min(25, Math.floor(score / 50));
      }
      localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(players));
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(players[pIndex]));
    }
    // Update tournament leaderboard if active
    const tournaments = this.getTournaments();
    tournaments.forEach(tour => {
      if (tour.gameId === gameId && tour.status === 'Live') {
        let entry = tour.leaderboard.find(item => item.phone === user.phone);
        if (entry) {
          if (score > entry.score) entry.score = score;
        } else {
          tour.leaderboard.push({
            rank: tour.leaderboard.length + 1,
            name: user.name,
            clan: user.clan || 'SOLO',
            phone: user.phone.replace(/(\d{5})\d{3}(\d{3})/, '$1***$2'),
            score: score,
            prize: '-',
            elo: user.eloRating || 1500
          });
        }
        tour.leaderboard.sort((a, b) => b.score - a.score);
        tour.leaderboard.forEach((item, idx) => {
          item.rank = idx + 1;
          if (idx === 0) item.prize = '50% Pool';
          else if (idx === 1) item.prize = '30% Pool';
          else if (idx === 2) item.prize = '20% Pool';
          else item.prize = '-';
        });
      }
    });
    localStorage.setItem(DB_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
    return true;
  },

  subscribe(planId, method = 'bKash', trxId = 'TRX' + Math.floor(100000 + Math.random() * 900000)) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Please login first' };
    const plan = DEFAULT_PLANS.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'Invalid plan' };

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + plan.days);

    const sub = {
      planName: plan.name,
      planId: plan.id,
      method,
      trxId,
      expiresAt: expireDate.toISOString(),
      active: true
    };

    const players = this.getPlayers();
    const pIndex = players.findIndex(p => p.id === user.id);
    if (pIndex >= 0) {
      players[pIndex].activeSubscription = sub;
      localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(players));
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(players[pIndex]));
    }
    return { success: true, subscription: sub };
  },

  exchangeTokensForSub(planId) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Please login first' };
    const plan = DEFAULT_PLANS.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'Invalid plan' };

    if ((user.tokens || 0) < plan.tokensRequired) {
      return { success: false, message: `Need ${plan.tokensRequired} tokens. You have ${user.tokens || 0} tokens.` };
    }

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + plan.days);

    const sub = {
      planName: plan.name,
      planId: plan.id,
      method: 'Token Exchange',
      trxId: 'TOK-' + Date.now().toString().slice(-6),
      expiresAt: expireDate.toISOString(),
      active: true
    };

    const players = this.getPlayers();
    const pIndex = players.findIndex(p => p.id === user.id);
    if (pIndex >= 0) {
      players[pIndex].tokens -= plan.tokensRequired;
      players[pIndex].activeSubscription = sub;
      localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(players));
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(players[pIndex]));
    }
    return { success: true, remainingTokens: user.tokens - plan.tokensRequired, subscription: sub };
  },

  getReviews(gameId) {
    this.init();
    try {
      const all = JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS)) || DEFAULT_REVIEWS;
      return gameId ? all.filter(r => r.gameId === gameId) : all;
    } catch (e) {
      return DEFAULT_REVIEWS;
    }
  },

  addReview(gameId, rating, comment) {
    const user = this.getCurrentUser();
    const all = this.getReviews();
    const review = {
      id: 'rev-' + Date.now(),
      gameId,
      playerName: user ? `${user.name} [${user.clan || 'PRO'}]` : 'Guest Gamer',
      rating: parseInt(rating, 10),
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    all.unshift(review);
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(all));
    return review;
  },

  getSmsLogs() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.SMS_LOGS)) || DEFAULT_SMS_LOGS;
    } catch (e) {
      return DEFAULT_SMS_LOGS;
    }
  },

  sendPromotionalSms(recipient, message) {
    const logs = this.getSmsLogs();
    const now = new Date();
    const entry = {
      id: 'sms-' + Date.now(),
      recipient,
      message,
      date: now.toISOString().replace('T', ' ').slice(0, 16)
    };
    logs.unshift(entry);
    localStorage.setItem(DB_KEYS.SMS_LOGS, JSON.stringify(logs));
    return entry;
  }
};

window.WapDB = WapDB;
window.DEFAULT_PLANS = DEFAULT_PLANS;
