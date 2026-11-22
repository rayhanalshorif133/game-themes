/**
 * WAP Games Portal - Central State & Data Management Store (LocalStorage DB)
 * Provides persistent mock database and reactive services for Admin & Player panels.
 */

const DB_KEYS = {
  GAMES: 'wap_games_list',
  TOURNAMENTS: 'wap_tournaments_list',
  PLAYERS: 'wap_players_list',
  SUBSCRIPTIONS: 'wap_subscriptions_list',
  REVIEWS: 'wap_reviews_list',
  SMS_LOGS: 'wap_sms_logs',
  CURRENT_USER: 'wap_current_user',
  SETTINGS: 'wap_portal_settings'
};

// Default seed data
const DEFAULT_GAMES = [
  {
    id: 'game-1',
    title: 'Space Blaster 2D',
    category: 'Action',
    type: 'Single Player', // 'Single Player' | 'Multiplayer'
    description: 'Destroy enemy spaceships, dodge meteorites and set high scores in space!',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    engineKey: 'space-blaster',
    isNew: true,
    playsCount: 1420,
    rules: [
      'Use Arrow Keys or A/D to move left and right (Touch left/right on mobile).',
      'Press Spacebar or Fire button to shoot laser blasts.',
      'Each alien destroyed gives +10 points. Asteroids give +20 points.',
      'You have 3 lives. Colliding with enemies or missiles loses 1 life.',
      'Tournaments count your highest score within the event period.'
    ]
  },
  {
    id: 'game-2',
    title: 'Neon Flappy 2D',
    category: 'Arcade',
    type: 'Single Player',
    description: 'Fly your neon craft between cyber obstacles. How far can you survive?',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60',
    engineKey: 'flappy-bird',
    isNew: true,
    playsCount: 2850,
    rules: [
      'Tap Screen or Press Space to flap and gain altitude.',
      'Avoid colliding with top and bottom neon barriers.',
      'Passing through each gate awards +1 score.',
      'Single life challenge: one crash ends the run!'
    ]
  },
  {
    id: 'game-3',
    title: 'Retro Snake Arena',
    category: 'Classic',
    type: 'Multiplayer',
    description: 'Classic snake with a competitive cyber twist. Grow longer and dominate the arena!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60',
    engineKey: 'retro-snake',
    isNew: false,
    playsCount: 3900,
    rules: [
      'Use Arrow keys, Swipe or On-screen D-Pad to control snake direction.',
      'Eat energy orbs to grow longer and gain +15 points.',
      'Do not hit the arena walls or your own tail.',
      'Speed increases as your snake grows longer.'
    ]
  },
  {
    id: 'game-4',
    title: 'Cyber Brick Breaker',
    category: 'Arcade',
    type: 'Single Player',
    description: 'Smash glowing neon bricks with high-speed energy balls and collect power-ups!',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500&auto=format&fit=crop&q=60',
    engineKey: 'brick-breaker',
    isNew: true,
    playsCount: 920,
    rules: [
      'Move the paddle left and right to bounce the ball.',
      'Break all bricks to clear the sector.',
      'Catch glowing bonus orbs for extra ball speed and paddle length.'
    ]
  }
];

const DEFAULT_TOURNAMENTS = [
  {
    id: 'trn-101',
    title: 'Space Blaster Mega League',
    gameId: 'game-1',
    gameTitle: 'Space Blaster 2D',
    type: 'Single Player',
    entryFeeType: 'money', // 'money' | 'token'
    entryFee: 10, // 10 BDT or tokens
    prizePool: '1,500 TK',
    startDate: '2026-11-15',
    endDate: '2026-11-25',
    status: 'Active', // 'Active' | 'Upcoming' | 'Completed'
    participantsCount: 84,
    rules: 'Top 3 players on the leaderboard by Nov 25 win cash prizes directly to their bKash/Nagad wallet.'
  },
  {
    id: 'trn-102',
    title: 'Neon Flappy 2D Clash',
    gameId: 'game-2',
    gameTitle: 'Neon Flappy 2D',
    type: 'Single Player',
    entryFeeType: 'token',
    entryFee: 20, // 20 tokens
    prizePool: '500 Tokens + 500 TK',
    startDate: '2026-11-18',
    endDate: '2026-11-22',
    status: 'Active',
    participantsCount: 132,
    rules: 'Enter using 20 tokens. Unlimited attempts during tournament window. Highest single run wins!'
  },
  {
    id: 'trn-103',
    title: 'Snake Arena Battle Royale',
    gameId: 'game-3',
    gameTitle: 'Retro Snake Arena',
    type: 'Multiplayer',
    entryFeeType: 'money',
    entryFee: 15,
    prizePool: '2,500 TK',
    startDate: '2026-11-28',
    endDate: '2026-12-05',
    status: 'Upcoming',
    participantsCount: 38,
    rules: 'Multiplayer brackets match players live. Knockout rounds decide the champion.'
  }
];

const DEFAULT_SUBS_PLANS = [
  { id: 'plan-1', name: '1 Day Pass', price: 3, durationDays: 1, tokenEquivalent: 50, popular: false, desc: '3 Taka per day - Instant access to all 2D games' },
  { id: 'plan-2', name: '2 Days Pass', price: 5, durationDays: 2, tokenEquivalent: 80, popular: true, desc: '5 Taka for 2 days - Best value for weekend gaming' },
  { id: 'plan-3', name: '5 Days Mega Pass', price: 10, durationDays: 5, tokenEquivalent: 150, popular: false, desc: '10 Taka for 5 days - Unrestricted tournament entry' },
  { id: 'plan-4', name: '15 Days Pro VIP', price: 20, durationDays: 15, tokenEquivalent: 250, popular: false, desc: '20 Taka for 15 days - VIP badge + 50 bonus tokens' }
];

const DEFAULT_PLAYERS = [
  {
    id: 'ply-1',
    name: 'Tanvir Hossain',
    phone: '01711002233',
    email: 'tanvir@gmail.com',
    password: '123',
    tokens: 75,
    referralCode: 'WAP-TANVIR',
    referredBy: null,
    referralCount: 3,
    banned: false,
    banReason: '',
    joinedAt: '2026-11-10',
    subscription: {
      planId: 'plan-2',
      planName: '2 Days Pass',
      active: true,
      expiresAt: '2026-11-21T23:59:59'
    },
    scores: {
      'game-1': 1480,
      'game-2': 42,
      'game-3': 750,
      'game-4': 2100
    },
    messages: [
      { id: 'm-1', date: '2026-11-18 10:30', from: 'Admin', text: 'Welcome to WAP Games! You received 50 free welcome tokens.' }
    ]
  },
  {
    id: 'ply-2',
    name: 'Sabbir Ahmed',
    phone: '01822334455',
    email: 'sabbir@yahoo.com',
    password: '123',
    tokens: 120,
    referralCode: 'WAP-SABBIR',
    referredBy: 'WAP-TANVIR',
    referralCount: 5,
    banned: false,
    banReason: '',
    joinedAt: '2026-11-12',
    subscription: {
      planId: 'plan-3',
      planName: '5 Days Mega Pass',
      active: true,
      expiresAt: '2026-11-23T23:59:59'
    },
    scores: {
      'game-1': 2340,
      'game-2': 58,
      'game-3': 1120,
      'game-4': 3450
    },
    messages: []
  },
  {
    id: 'ply-3',
    name: 'Rakibul Islam',
    phone: '01933445566',
    email: 'rakib@outlook.com',
    password: '123',
    tokens: 25,
    referralCode: 'WAP-RAKIB',
    referredBy: null,
    referralCount: 1,
    banned: false,
    banReason: '',
    joinedAt: '2026-11-14',
    subscription: {
      planId: null,
      planName: 'None',
      active: false,
      expiresAt: null
    },
    scores: {
      'game-1': 890,
      'game-2': 18,
      'game-3': 410,
      'game-4': 950
    },
    messages: []
  }
];

const DEFAULT_REVIEWS = [
  { id: 'rev-1', gameId: 'game-1', playerName: 'Tanvir Hossain', rating: 5, comment: 'Awesome 2D graphics and sound! Addictive space game.', date: '2026-11-17' },
  { id: 'rev-2', gameId: 'game-1', playerName: 'Sabbir Ahmed', rating: 4, comment: 'Very smooth on mobile device. High score tournament is awesome.', date: '2026-11-18' },
  { id: 'rev-3', gameId: 'game-2', playerName: 'Rakibul Islam', rating: 5, comment: 'Best flappy 2D version so far! Loving the neon effects.', date: '2026-11-16' },
  { id: 'rev-4', gameId: 'game-3', playerName: 'Tanvir Hossain', rating: 5, comment: 'Multiplayer challenge is super competitive. Keep it up!', date: '2026-11-18' }
];

const DEFAULT_SMS_LOGS = [
  { id: 'sms-1', title: '50 Token Free Bonus Alert', audience: 'All Players', message: 'Sign up now and get 50 tokens free to unlock your subscription on WAP Games!', date: '2026-11-15 14:00', recipientCount: 240, status: 'Sent' },
  { id: 'sms-2', title: 'Weekend Space Blaster Tournament', audience: 'Active Subscribers', message: 'Win 1,500 TK bKash prize pool in Space Blaster 2D league. Ends Sunday!', date: '2026-11-18 18:30', recipientCount: 115, status: 'Sent' }
];

const DEFAULT_SUBS_HISTORY = [
  { id: 'sub-tx-1', playerId: 'ply-1', playerName: 'Tanvir Hossain', phone: '01711002233', planName: '2 Days Pass', amount: '5 TK', method: 'bKash', trxId: 'BK9X8741A', status: 'Approved', date: '2026-11-19 09:12' },
  { id: 'sub-tx-2', playerId: 'ply-2', playerName: 'Sabbir Ahmed', phone: '01822334455', planName: '5 Days Mega Pass', amount: '10 TK', method: 'bKash', trxId: 'BK2M9901Z', status: 'Approved', date: '2026-11-18 16:45' },
  { id: 'sub-tx-3', playerId: 'ply-1', playerName: 'Tanvir Hossain', phone: '01711002233', planName: '1 Day Pass', amount: '50 Tokens', method: 'Token Exchange', trxId: 'TOK-EXC-44', status: 'Completed', date: '2026-11-10 11:00' }
];

const DEFAULT_SETTINGS = {
  portalName: 'WAP Games 2D',
  tagline: 'Play 2D Web Games, Win Cash & Tournaments',
  whatsappNumber: '8801700000000',
  supportEmail: 'support@wapgames.com',
  bkashNumber: '01711-223344 (Personal/Merchant)',
  nagadNumber: '01822-334455 (Merchant)',
  signupBonusTokens: 50,
  referralBonusTokens: 25,
  bannerNotice: '⚡ Play 2D Single & Multiplayer Tournaments - Win instant bKash Cash Rewards daily!'
};

// Database Initializer
class WAPDatabase {
  constructor() {
    this.init();
  }

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
    if (!localStorage.getItem(DB_KEYS.SUBSCRIPTIONS)) {
      localStorage.setItem(DB_KEYS.SUBSCRIPTIONS, JSON.stringify(DEFAULT_SUBS_HISTORY));
    }
    if (!localStorage.getItem(DB_KEYS.SETTINGS)) {
      localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  // --- Games CRUD ---
  getGames() {
    return JSON.parse(localStorage.getItem(DB_KEYS.GAMES) || '[]');
  }

  getGameById(id) {
    return this.getGames().find(g => g.id === id);
  }

  saveGame(game) {
    const games = this.getGames();
    const index = games.findIndex(g => g.id === game.id);
    if (index >= 0) {
      games[index] = { ...games[index], ...game };
    } else {
      games.push({
        id: 'game-' + Date.now(),
        playsCount: 0,
        isNew: true,
        ...game
      });
    }
    localStorage.setItem(DB_KEYS.GAMES, JSON.stringify(games));
    return true;
  }

  deleteGame(id) {
    const games = this.getGames().filter(g => g.id !== id);
    localStorage.setItem(DB_KEYS.GAMES, JSON.stringify(games));
    return true;
  }

  incrementGamePlay(id) {
    const games = this.getGames();
    const game = games.find(g => g.id === id);
    if (game) {
      game.playsCount = (game.playsCount || 0) + 1;
      localStorage.setItem(DB_KEYS.GAMES, JSON.stringify(games));
    }
  }

  // --- Tournaments CRUD ---
  getTournaments() {
    return JSON.parse(localStorage.getItem(DB_KEYS.TOURNAMENTS) || '[]');
  }

  getTournamentById(id) {
    return this.getTournaments().find(t => t.id === id);
  }

  saveTournament(tournament) {
    const list = this.getTournaments();
    const index = list.findIndex(t => t.id === tournament.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...tournament };
    } else {
      list.push({
        id: 'trn-' + Date.now(),
        participantsCount: 0,
        ...tournament
      });
    }
    localStorage.setItem(DB_KEYS.TOURNAMENTS, JSON.stringify(list));
    return true;
  }

  deleteTournament(id) {
    const list = this.getTournaments().filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TOURNAMENTS, JSON.stringify(list));
    return true;
  }

  // --- Players Management ---
  getPlayers() {
    return JSON.parse(localStorage.getItem(DB_KEYS.PLAYERS) || '[]');
  }

  getPlayerById(id) {
    return this.getPlayers().find(p => p.id === id);
  }

  getPlayerByPhoneOrEmail(identity) {
    return this.getPlayers().find(p => p.phone === identity || p.email === identity);
  }

  savePlayer(player) {
    const players = this.getPlayers();
    const idx = players.findIndex(p => p.id === player.id);
    if (idx >= 0) {
      players[idx] = { ...players[idx], ...player };
    } else {
      players.push(player);
    }
    localStorage.setItem(DB_KEYS.PLAYERS, JSON.stringify(players));

    // Update current user session if it's the same user
    const cur = this.getCurrentUser();
    if (cur && cur.id === player.id) {
      this.setCurrentUser(player);
    }
    return true;
  }

  updatePlayerProfile(id, updates) {
    const player = this.getPlayerById(id);
    if (!player) return { success: false, message: 'Player not found' };
    
    Object.assign(player, updates);
    this.savePlayer(player);
    return { success: true, player };
  }

  // --- OTP Verification Service ---
  sendOtp(phone) {
    if (!phone) {
      return { success: false, message: 'ফোন নম্বর প্রদান করুন।' };
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let normalizedPhone = cleanPhone;
    if (normalizedPhone.startsWith('880')) {
      normalizedPhone = '0' + normalizedPhone.slice(3);
    }
    if (normalizedPhone.length !== 11 || !normalizedPhone.startsWith('01')) {
      return { success: false, message: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711002233)।' };
    }

    // Generate random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 mins

    const otpData = {
      phone: normalizedPhone,
      otp: otp,
      expiresAt: expiry
    };
    sessionStorage.setItem('wap_pending_otp', JSON.stringify(otpData));

    const existingPlayer = this.getPlayerByPhoneOrEmail(normalizedPhone);

    return {
      success: true,
      phone: normalizedPhone,
      otp: otp,
      isExisting: !!existingPlayer,
      playerName: existingPlayer ? existingPlayer.name : null,
      message: `OTP কোড সফলভাবে পাঠানো হয়েছে: ${otp}`
    };
  }

  verifyOtp(phone, inputOtp, gamerName = '', referralCode = '') {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    let normalizedPhone = cleanPhone;
    if (normalizedPhone.startsWith('880')) {
      normalizedPhone = '0' + normalizedPhone.slice(3);
    }

    const pendingRaw = sessionStorage.getItem('wap_pending_otp');
    let validOtp = false;

    // Support universal demo bypass code 1234 or matching stored OTP
    if (inputOtp === '1234') {
      validOtp = true;
    } else if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw);
        if (pending.phone === normalizedPhone && pending.otp === inputOtp.trim()) {
          if (Date.now() <= pending.expiresAt) {
            validOtp = true;
          } else {
            return { success: false, message: 'OTP এর মেয়াদ শেষ হয়ে গেছে। নতুন OTP পাঠান।' };
          }
        }
      } catch (e) {}
    }

    if (!validOtp) {
      return { success: false, message: 'ভুল OTP কোড! আবার চেষ্টা করুন (টেস্টিং কোড: 1234)।' };
    }

    sessionStorage.removeItem('wap_pending_otp');

    // Check if player exists
    let player = this.getPlayerByPhoneOrEmail(normalizedPhone);
    if (player) {
      if (player.banned) {
        return { success: false, message: `আপনার একাউন্টটি ব্যান করা হয়েছে! কারণ: ${player.banReason || 'কর্তৃপক্ষের সাথে যোগাযোগ করুন'}` };
      }
      this.setCurrentUser(player);
      return { success: true, isNew: false, player, message: `স্বাগতম ${player.name}! সফলভাবে লগইন হয়েছে।` };
    }

    // New Player -> Auto-register with 50 bonus tokens
    const settings = this.getSettings();
    const defaultName = gamerName.trim() || ('Gamer_' + normalizedPhone.slice(-4));
    const newPlayer = {
      id: 'ply-' + Date.now(),
      name: defaultName,
      phone: normalizedPhone,
      email: '',
      password: 'otp_' + Date.now().toString(36),
      avatar: '👾',
      tokens: settings.signupBonusTokens || 50,
      referralCode: 'WAP-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      referredBy: referralCode ? referralCode.trim().toUpperCase() : null,
      referralCount: 0,
      banned: false,
      banReason: '',
      joinedAt: new Date().toISOString().split('T')[0],
      subscription: {
        planId: null,
        planName: 'None',
        active: false,
        expiresAt: null
      },
      scores: {},
      messages: [
        {
          id: 'msg-welcome',
          date: new Date().toLocaleString(),
          from: 'WAP Arcade Operator',
          text: `🎉 স্বাগতম WAP Games এ! আপনি নতুন সাইনআপ উপলক্ষে ৫০ ফ্রি টোকেন কয়েন পেয়েছেন। এই কয়েন দিয়ে গেম সাবস্ক্রিপশন নিতে পারবেন!`
        }
      ]
    };

    if (referralCode) {
      const allPlayers = this.getPlayers();
      const referrer = allPlayers.find(p => p.referralCode === referralCode.trim().toUpperCase());
      if (referrer) {
        referrer.tokens = (referrer.tokens || 0) + (settings.referralBonusTokens || 25);
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        if (!referrer.messages) referrer.messages = [];
        referrer.messages.unshift({
          id: 'ref-bonus-' + Date.now(),
          date: new Date().toLocaleString(),
          from: 'Referral Reward',
          text: `🎁 আপনার রেফারেল কোড ব্যবহার করে ${newPlayer.name} যোগ দিয়েছে! আপনি ২৫ টোকেন পেয়েছেন।`
        });
        this.savePlayer(referrer);
      }
    }

    this.savePlayer(newPlayer);
    this.setCurrentUser(newPlayer);
    return {
      success: true,
      isNew: true,
      player: newPlayer,
      message: `🎉 অভিনন্দন! নতুন অ্যাকাউন্ট তৈরি হয়েছে এবং ৫০ ফ্রি টোকেন যুক্ত হয়েছে!`
    };
  }

  toggleBanPlayer(id, reason = '') {
    const player = this.getPlayerById(id);
    if (player) {
      player.banned = !player.banned;
      player.banReason = player.banned ? (reason || 'Violation of fair play rules') : '';
      this.savePlayer(player);
      return player.banned;
    }
    return false;
  }

  sendMessageToPlayer(playerId, text) {
    const player = this.getPlayerById(playerId);
    if (player) {
      if (!player.messages) player.messages = [];
      player.messages.unshift({
        id: 'msg-' + Date.now(),
        date: new Date().toLocaleString(),
        from: 'Admin',
        text: text
      });
      this.savePlayer(player);
      return true;
    }
    return false;
  }

  // --- Auth & Session ---
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(DB_KEYS.CURRENT_USER) || 'null');
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(DB_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  login(identifier, password) {
    const player = this.getPlayers().find(p => (p.phone === identifier || p.email === identifier) && p.password === password);
    if (!player) {
      return { success: false, message: 'Invalid phone/email or password.' };
    }
    if (player.banned) {
      return { success: false, message: `Your account is BANNED! Reason: ${player.banReason || 'Contact support'}` };
    }
    this.setCurrentUser(player);
    return { success: true, player };
  }

  register(userData) {
    const existing = this.getPlayerByPhoneOrEmail(userData.phone) || (userData.email && this.getPlayerByPhoneOrEmail(userData.email));
    if (existing) {
      return { success: false, message: 'Account with this phone or email already exists!' };
    }

    const settings = this.getSettings();
    const newPlayer = {
      id: 'ply-' + Date.now(),
      name: userData.name || 'New Gamer',
      phone: userData.phone,
      email: userData.email || '',
      password: userData.password,
      tokens: settings.signupBonusTokens || 50, // 50 Free tokens on signup
      referralCode: 'WAP-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      referredBy: userData.referralCode || null,
      referralCount: 0,
      banned: false,
      banReason: '',
      joinedAt: new Date().toISOString().split('T')[0],
      subscription: {
        planId: null,
        planName: 'None',
        active: false,
        expiresAt: null
      },
      scores: {},
      messages: [
        {
          id: 'msg-welcome',
          date: new Date().toLocaleString(),
          from: 'Admin System',
          text: `🎉 Welcome to WAP Games! You received ${settings.signupBonusTokens || 50} free bonus tokens. You can exchange tokens for game subscriptions!`
        }
      ]
    };

    // If referral code used, reward the referrer!
    if (userData.referralCode) {
      const allPlayers = this.getPlayers();
      const referrer = allPlayers.find(p => p.referralCode === userData.referralCode.trim().toUpperCase());
      if (referrer) {
        referrer.tokens = (referrer.tokens || 0) + (settings.referralBonusTokens || 25);
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        if (!referrer.messages) referrer.messages = [];
        referrer.messages.unshift({
          id: 'ref-bonus-' + Date.now(),
          date: new Date().toLocaleString(),
          from: 'Referral Reward',
          text: `🎁 Someone joined using your referral code (${referrer.referralCode})! You earned ${settings.referralBonusTokens || 25} bonus tokens!`
        });
        this.savePlayer(referrer);
      }
    }

    this.savePlayer(newPlayer);
    this.setCurrentUser(newPlayer);
    return { success: true, player: newPlayer };
  }

  signup(userData) {
    return this.register(userData);
  }

  logout() {
    this.setCurrentUser(null);
  }

  // --- Subscriptions & Pricing ---
  getPlans() {
    return DEFAULT_SUBS_PLANS;
  }

  hasActiveSubscription(player) {
    if (!player || !player.subscription || !player.subscription.active) return false;
    if (!player.subscription.expiresAt) return false;
    const now = new Date().getTime();
    const expiry = new Date(player.subscription.expiresAt).getTime();
    return expiry > now;
  }

  purchaseSubscription(playerId, planId, paymentMethod, trxId = '') {
    const player = this.getPlayerById(playerId);
    const plan = this.getPlans().find(p => p.id === planId);
    if (!player || !plan) return { success: false, message: 'Invalid player or plan' };

    const now = new Date();
    const expiry = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    player.subscription = {
      planId: plan.id,
      planName: plan.name,
      active: true,
      expiresAt: expiry.toISOString()
    };

    // Log transaction
    const tx = {
      id: 'sub-tx-' + Date.now(),
      playerId: player.id,
      playerName: player.name,
      phone: player.phone,
      planName: plan.name,
      amount: plan.price + ' TK',
      method: paymentMethod, // bKash, Nagad, Card
      trxId: trxId || 'AUTO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'Approved',
      date: new Date().toLocaleString()
    };

    const subs = this.getSubscriptionHistory();
    subs.unshift(tx);
    localStorage.setItem(DB_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));

    if (!player.messages) player.messages = [];
    player.messages.unshift({
      id: 'sub-msg-' + Date.now(),
      date: new Date().toLocaleString(),
      from: 'Billing System',
      text: `✅ Subscription Activated! You purchased "${plan.name}" via ${paymentMethod}. Valid until ${expiry.toLocaleDateString()}. Enjoy unlimited gaming!`
    });

    this.savePlayer(player);
    return { success: true, player, expiry: expiry.toLocaleDateString() };
  }

  subscribeWithMoney(playerId, planId, paymentMethod, trxId = '', phone = '') {
    return this.purchaseSubscription(playerId, planId, paymentMethod, trxId);
  }

  exchangeTokensForSubscription(playerId, planId) {
    const player = this.getPlayerById(playerId);
    const plan = this.getPlans().find(p => p.id === planId);
    if (!player || !plan) return { success: false, message: 'Invalid player or plan' };

    const tokensRequired = plan.tokenEquivalent;
    if ((player.tokens || 0) < tokensRequired) {
      return { success: false, message: `Insufficient tokens! You need ${tokensRequired} tokens, but you only have ${player.tokens || 0} tokens.` };
    }

    player.tokens -= tokensRequired;
    const now = new Date();
    const expiry = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    player.subscription = {
      planId: plan.id,
      planName: plan.name + ' (Token Exchange)',
      active: true,
      expiresAt: expiry.toISOString()
    };

    const tx = {
      id: 'sub-tok-' + Date.now(),
      playerId: player.id,
      playerName: player.name,
      phone: player.phone,
      planName: plan.name,
      amount: tokensRequired + ' Tokens',
      method: 'Token Exchange',
      trxId: 'TOK-EX-' + Date.now().toString().slice(-6),
      status: 'Completed',
      date: new Date().toLocaleString()
    };

    const subs = this.getSubscriptionHistory();
    subs.unshift(tx);
    localStorage.setItem(DB_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));

    if (!player.messages) player.messages = [];
    player.messages.unshift({
      id: 'tok-msg-' + Date.now(),
      date: new Date().toLocaleString(),
      from: 'Token Exchange',
      text: `🪙 Success! Exchanged ${tokensRequired} tokens for "${plan.name}". Valid until ${expiry.toLocaleDateString()}.`
    });

    this.savePlayer(player);
    return { success: true, player, expiry: expiry.toLocaleDateString() };
  }

  getSubscriptionHistory() {
    return JSON.parse(localStorage.getItem(DB_KEYS.SUBSCRIPTIONS) || '[]');
  }

  // --- Leaderboards & Scores ---
  recordScore(playerId, gameId, newScore) {
    const player = this.getPlayerById(playerId);
    if (!player) return;
    if (!player.scores) player.scores = {};
    const curScore = player.scores[gameId] || 0;
    if (newScore > curScore) {
      player.scores[gameId] = newScore;
      this.savePlayer(player);
    }
  }

  getLeaderboard(gameId) {
    const players = this.getPlayers();
    const scores = [];
    players.forEach(p => {
      if (p.scores && p.scores[gameId] !== undefined) {
        scores.push({
          playerId: p.id,
          playerName: p.name,
          score: p.scores[gameId],
          subscriptionActive: this.hasActiveSubscription(p)
        });
      }
    });
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 15);
  }

  // --- Reviews & Feedback ---
  getReviews(gameId = null) {
    const all = JSON.parse(localStorage.getItem(DB_KEYS.REVIEWS) || '[]');
    if (gameId) {
      return all.filter(r => r.gameId === gameId);
    }
    return all;
  }

  addReview(gameId, playerName, rating, comment) {
    const reviews = this.getReviews();
    const newRev = {
      id: 'rev-' + Date.now(),
      gameId,
      playerName: playerName || 'Anonymous Gamer',
      rating: parseInt(rating) || 5,
      comment: comment || 'Nice 2D game!',
      date: new Date().toISOString().split('T')[0]
    };
    reviews.unshift(newRev);
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify(reviews));
    return newRev;
  }

  // --- Promotional SMS Broadcast ---
  getSmsLogs() {
    return JSON.parse(localStorage.getItem(DB_KEYS.SMS_LOGS) || '[]');
  }

  sendPromotionalSms(title, audience, message) {
    const players = this.getPlayers();
    let targetPlayers = [];

    if (audience === 'Active Subscribers') {
      targetPlayers = players.filter(p => this.hasActiveSubscription(p));
    } else if (audience === 'Inactive Players') {
      targetPlayers = players.filter(p => !this.hasActiveSubscription(p));
    } else {
      // All
      targetPlayers = players;
    }

    // Deliver notification message to all target players' inboxes
    targetPlayers.forEach(p => {
      if (!p.messages) p.messages = [];
      p.messages.unshift({
        id: 'promo-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        date: new Date().toLocaleString(),
        from: 'WAP Promo SMS',
        text: `📢 [${title}] ${message}`
      });
      this.savePlayer(p);
    });

    const newLog = {
      id: 'sms-' + Date.now(),
      title,
      audience,
      message,
      date: new Date().toLocaleString(),
      recipientCount: targetPlayers.length,
      status: 'Sent'
    };

    const logs = this.getSmsLogs();
    logs.unshift(newLog);
    localStorage.setItem(DB_KEYS.SMS_LOGS, JSON.stringify(logs));
    return newLog;
  }

  // --- Portal Settings ---
  getSettings() {
    return JSON.parse(localStorage.getItem(DB_KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS));
  }

  saveSettings(newSettings) {
    const s = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(DB_KEYS.SETTINGS, JSON.stringify(s));
    return s;
  }
}

// Global instance
window.wapDB = new WAPDatabase();
