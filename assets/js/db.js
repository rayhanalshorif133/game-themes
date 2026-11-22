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
  SETTINGS: 'wap_portal_settings',
  PLAY_ACTIVITY: 'wap_play_activity_logs',
  SCORES_AUDIT: 'wap_scores_audit_logs',
  WINNER_PAYOUTS: 'wap_winner_payouts_list',
  ADMIN_ROLES: 'wap_admin_roles_list',
  CARRIER_CHARGES: 'wap_carrier_charges_list',
  TRAFFIC_LOGS: 'wap_traffic_logs_list',
  CONTACT_GROUPS: 'wap_contact_groups_list',
  USER_TRACKING: 'wap_user_tracking_list'
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

const DEFAULT_PLAY_ACTIVITY = [
  { id: 'act-1', playerName: 'Tanvir Hossain', phone: '01711002233', gameTitle: 'Space Blaster 2D', score: 1480, duration: '4m 32s', device: 'Android (Chrome)', ip: '103.114.98.12', time: '10 mins ago' },
  { id: 'act-2', playerName: 'Sabbir Ahmed', phone: '01822334455', gameTitle: 'Neon Flappy 2D', score: 58, duration: '2m 14s', device: 'iOS (Safari)', ip: '27.147.202.45', time: '25 mins ago' },
  { id: 'act-3', playerName: 'Rakibul Islam', phone: '01933445566', gameTitle: 'Retro Snake Arena', score: 410, duration: '6m 05s', device: 'Android (GP 4G)', ip: '119.30.38.102', time: '1 hour ago' },
  { id: 'act-4', playerName: 'Tanvir Hossain', phone: '01711002233', gameTitle: 'Cyber Brick Breaker', score: 2100, duration: '5m 50s', device: 'Desktop (Windows)', ip: '103.114.98.12', time: '2 hours ago' },
  { id: 'act-5', playerName: 'Gamer_9821', phone: '01677889900', gameTitle: 'Space Blaster 2D', score: 820, duration: '3m 10s', device: 'Android (Robi)', ip: '182.160.118.23', time: '3 hours ago' },
  { id: 'act-6', playerName: 'Sabbir Ahmed', phone: '01822334455', gameTitle: 'Cyber Brick Breaker', score: 3450, duration: '7m 40s', device: 'iOS (Safari)', ip: '27.147.202.45', time: '5 hours ago' }
];

const DEFAULT_SCORES_AUDIT = [
  { id: 'sc-aud-1', playerId: 'ply-2', playerName: 'Sabbir Ahmed', gameTitle: 'Cyber Brick Breaker', submittedScore: 3450, prevHighScore: 2800, status: 'Verified', checksum: 'HASH-OK-8842', auditNote: 'Legitimate gameplay duration and paddle bounce intervals verified.', date: '2026-11-20 18:20' },
  { id: 'sc-aud-2', playerId: 'ply-1', playerName: 'Tanvir Hossain', gameTitle: 'Space Blaster 2D', submittedScore: 1480, prevHighScore: 1100, status: 'Verified', checksum: 'HASH-OK-3120', auditNote: 'Standard enemy kill cadence. Clean score delta.', date: '2026-11-19 14:15' },
  { id: 'sc-aud-3', playerId: 'ply-99', playerName: 'SpeedyBot_X', gameTitle: 'Neon Flappy 2D', submittedScore: 9840, prevHighScore: 20, status: 'Suspicious', checksum: 'HASH-FAIL-XX9', auditNote: 'Abnormal score surge (+9820 pts in 12s). Scripting suspected.', date: '2026-11-18 22:40' },
  { id: 'sc-aud-4', playerId: 'ply-3', playerName: 'Rakibul Islam', gameTitle: 'Retro Snake Arena', submittedScore: 410, prevHighScore: 350, status: 'Verified', checksum: 'HASH-OK-7711', auditNote: 'Multiplayer tick rate within normal tolerance.', date: '2026-11-18 11:05' }
];

const DEFAULT_WINNER_PAYOUTS = [
  { id: 'win-101', tournament: 'Space Blaster Mega League', playerName: 'Sabbir Ahmed', phone: '01822334455', rank: '1st Place', prize: '800 TK', method: 'bKash', trxId: 'BK90124A', status: 'Paid', date: '2026-11-18' },
  { id: 'win-102', tournament: 'Space Blaster Mega League', playerName: 'Tanvir Hossain', phone: '01711002233', rank: '2nd Place', prize: '500 TK', method: 'bKash', trxId: 'BK77812B', status: 'Paid', date: '2026-11-18' },
  { id: 'win-103', tournament: 'Space Blaster Mega League', playerName: 'Rakibul Islam', phone: '01933445566', rank: '3rd Place', prize: '200 TK', method: 'Nagad', trxId: 'NG44019Z', status: 'Paid', date: '2026-11-18' },
  { id: 'win-104', tournament: 'Neon Flappy 2D Clash', playerName: 'Tanvir Hossain', phone: '01711002233', rank: '1st Place', prize: '500 TK + 500 Coins', method: 'bKash', trxId: 'BK33901M', status: 'Approved', date: '2026-11-21' },
  { id: 'win-105', tournament: 'Snake Arena Battle Royale', playerName: 'Farhan Kabir', phone: '01511223344', rank: 'Upcoming Prize', prize: '1,000 TK', method: 'bKash', trxId: 'PENDING', status: 'Pending', date: '2026-11-22' }
];

const DEFAULT_ADMIN_ROLES = [
  { id: 'adm-1', name: 'Rayhan Shorif', email: 'admin@wapgames.com', role: 'Super Admin', permissions: 'Full Access (A to Z)', status: 'Active', lastLogin: 'Just now' },
  { id: 'adm-2', name: 'Karim Ahmed', email: 'moderator@wapgames.com', role: 'Game Ops Moderator', permissions: 'Games, Tournaments, Feedbacks', status: 'Active', lastLogin: '2 hours ago' },
  { id: 'adm-3', name: 'Nusrat Jahan', email: 'finance@wapgames.com', role: 'Finance Manager', permissions: 'Winner Payments, Carrier Logs, Revenue', status: 'Active', lastLogin: 'Yesterday' },
  { id: 'adm-4', name: 'Hasan Ali', email: 'support@wapgames.com', role: 'Support & Messaging', permissions: 'SMS Center, Player Ban/Unban', status: 'Active', lastLogin: '3 days ago' }
];

const DEFAULT_CARRIER_CHARGES = [
  { id: 'chg-101', telco: 'Grameenphone', phone: '01711002233', amount: '3 TK', plan: '1 Day Pass', status: 'Success', trx: 'GP-WAP-884102', time: 'Today 10:14 AM' },
  { id: 'chg-102', telco: 'Robi', phone: '01822334455', amount: '5 TK', plan: '2 Days Pass', status: 'Success', trx: 'ROBI-WAP-119024', time: 'Today 09:30 AM' },
  { id: 'chg-103', telco: 'Banglalink', phone: '01933445566', amount: '10 TK', plan: '5 Days Pass', status: 'Failed', reason: 'Insufficient Balance', trx: 'BL-WAP-773412', time: 'Today 08:45 AM' },
  { id: 'chg-104', telco: 'Teletalk', phone: '01511223344', amount: '3 TK', plan: '1 Day Pass', status: 'Success', trx: 'TT-WAP-332190', time: 'Yesterday 11:20 PM' },
  { id: 'chg-105', telco: 'Grameenphone', phone: '01799887766', amount: '5 TK', plan: '2 Days Pass', status: 'Success', trx: 'GP-WAP-990412', time: 'Yesterday 07:15 PM' },
  { id: 'chg-106', telco: 'Robi', phone: '01811998877', amount: '3 TK', plan: '1 Day Pass', status: 'Success', trx: 'ROBI-WAP-448201', time: 'Yesterday 04:30 PM' }
];

const DEFAULT_TRAFFIC_LOGS = [
  { id: 'trf-1', ip: '103.114.98.12', operator: 'Grameenphone 4G', device: 'Xiaomi Poco X3 (Android 13)', page: '/player/play.html?id=game-1', referrer: 'SMS Campaign #1', time: '1 min ago' },
  { id: 'trf-2', ip: '27.147.202.45', operator: 'Robi Axiata', device: 'iPhone 14 (iOS 17)', page: '/player/index.html', referrer: 'Direct WAP Portal', time: '3 mins ago' },
  { id: 'trf-3', ip: '119.30.38.102', operator: 'Banglalink Digital', device: 'Samsung Galaxy A52', page: '/index.html#tournaments', referrer: 'Facebook Promo', time: '7 mins ago' },
  { id: 'trf-4', ip: '180.211.214.5', operator: 'Dot Internet Fiber', device: 'Windows 11 / Chrome 124', page: '/admin/index.html', referrer: 'Direct Bookmark', time: '12 mins ago' },
  { id: 'trf-5', ip: '103.230.106.88', operator: 'Teletalk 4G', device: 'Realme 8 5G', page: '/player/play.html?id=game-2', referrer: 'WhatsApp Referral', time: '18 mins ago' }
];

const DEFAULT_CONTACT_GROUPS = [
  { id: 'grp-1', name: 'VIP Daily Gamers', count: 420, operatorTarget: 'All Operators', description: 'Top active players with passes in last 3 days', tags: ['High Spenders', 'Active'] },
  { id: 'grp-2', name: 'Active Pass Subscribers', count: 185, operatorTarget: 'bKash + Carrier', description: 'Players with unexpired 1, 2, or 5-day passes', tags: ['Subscribers'] },
  { id: 'grp-3', name: 'Inactive Players (7+ Days)', count: 890, operatorTarget: 'All', description: 'Re-engagement target audience for 50 bonus token promo', tags: ['Churned'] },
  { id: 'grp-4', name: 'Grameenphone Users (017/013)', count: 1240, operatorTarget: 'Grameenphone', description: 'Target group for GP carrier billing pass offer', tags: ['GP Special'] },
  { id: 'grp-5', name: 'Robi & Airtel Gamers (018/016)', count: 950, operatorTarget: 'Robi / Airtel', description: 'Weekend tournament promotion segment', tags: ['Robi Blitz'] }
];

const DEFAULT_USER_TRACKING = [
  { id: 'trk-1', channel: 'Facebook Retro Ads', impressions: 45200, clicks: 3820, signups: 610, conversionRate: '15.9%', costPerLead: '1.8 TK', activePlayers: 420 },
  { id: 'trk-2', channel: 'TikTok Influencer Video', impressions: 68000, clicks: 5400, signups: 890, conversionRate: '16.4%', costPerLead: '1.4 TK', activePlayers: 670 },
  { id: 'trk-3', channel: 'Player Referral Viral Loop', impressions: 12400, clicks: 2100, signups: 490, conversionRate: '23.3%', costPerLead: '0.0 TK', activePlayers: 380 },
  { id: 'trk-4', channel: 'Carrier WAP Push SMS', impressions: 28000, clicks: 4200, signups: 740, conversionRate: '17.6%', costPerLead: '1.2 TK', activePlayers: 560 },
  { id: 'trk-5', channel: 'Organic Search & Direct', impressions: 9500, clicks: 3100, signups: 520, conversionRate: '16.7%', costPerLead: '0.0 TK', activePlayers: 410 }
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
    if (!localStorage.getItem(DB_KEYS.PLAY_ACTIVITY)) {
      localStorage.setItem(DB_KEYS.PLAY_ACTIVITY, JSON.stringify(DEFAULT_PLAY_ACTIVITY));
    }
    if (!localStorage.getItem(DB_KEYS.SCORES_AUDIT)) {
      localStorage.setItem(DB_KEYS.SCORES_AUDIT, JSON.stringify(DEFAULT_SCORES_AUDIT));
    }
    if (!localStorage.getItem(DB_KEYS.WINNER_PAYOUTS)) {
      localStorage.setItem(DB_KEYS.WINNER_PAYOUTS, JSON.stringify(DEFAULT_WINNER_PAYOUTS));
    }
    if (!localStorage.getItem(DB_KEYS.ADMIN_ROLES)) {
      localStorage.setItem(DB_KEYS.ADMIN_ROLES, JSON.stringify(DEFAULT_ADMIN_ROLES));
    }
    if (!localStorage.getItem(DB_KEYS.CARRIER_CHARGES)) {
      localStorage.setItem(DB_KEYS.CARRIER_CHARGES, JSON.stringify(DEFAULT_CARRIER_CHARGES));
    }
    if (!localStorage.getItem(DB_KEYS.TRAFFIC_LOGS)) {
      localStorage.setItem(DB_KEYS.TRAFFIC_LOGS, JSON.stringify(DEFAULT_TRAFFIC_LOGS));
    }
    if (!localStorage.getItem(DB_KEYS.CONTACT_GROUPS)) {
      localStorage.setItem(DB_KEYS.CONTACT_GROUPS, JSON.stringify(DEFAULT_CONTACT_GROUPS));
    }
    if (!localStorage.getItem(DB_KEYS.USER_TRACKING)) {
      localStorage.setItem(DB_KEYS.USER_TRACKING, JSON.stringify(DEFAULT_USER_TRACKING));
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

  // --- Play Activity ---
  getPlayActivity() {
    return JSON.parse(localStorage.getItem(DB_KEYS.PLAY_ACTIVITY) || '[]');
  }

  logPlayActivity(activity) {
    const logs = this.getPlayActivity();
    const item = {
      id: 'act-' + Date.now(),
      time: 'Just now',
      ...activity
    };
    logs.unshift(item);
    localStorage.setItem(DB_KEYS.PLAY_ACTIVITY, JSON.stringify(logs));
    return item;
  }

  // --- Scores Audit ---
  getScoresAudit() {
    return JSON.parse(localStorage.getItem(DB_KEYS.SCORES_AUDIT) || '[]');
  }

  updateScoreAuditStatus(id, newStatus, note = '') {
    const list = this.getScoresAudit();
    const item = list.find(s => s.id === id);
    if (item) {
      item.status = newStatus;
      if (note) item.auditNote = note;
      localStorage.setItem(DB_KEYS.SCORES_AUDIT, JSON.stringify(list));
      return true;
    }
    return false;
  }

  resetPlayerScore(playerId, gameTitle) {
    const player = this.getPlayerById(playerId);
    if (player && player.scores) {
      const game = this.getGames().find(g => g.title === gameTitle);
      if (game && player.scores[game.id] !== undefined) {
        player.scores[game.id] = 0;
        this.savePlayer(player);
        return true;
      }
    }
    return false;
  }

  // --- Winner Payments ---
  getWinnerPayouts() {
    return JSON.parse(localStorage.getItem(DB_KEYS.WINNER_PAYOUTS) || '[]');
  }

  updatePayoutStatus(id, newStatus, trxId = '') {
    const list = this.getWinnerPayouts();
    const item = list.find(w => w.id === id);
    if (item) {
      item.status = newStatus;
      if (trxId) item.trxId = trxId;
      localStorage.setItem(DB_KEYS.WINNER_PAYOUTS, JSON.stringify(list));
      return true;
    }
    return false;
  }

  addWinnerPayout(payout) {
    const list = this.getWinnerPayouts();
    const item = {
      id: 'win-' + Date.now(),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      ...payout
    };
    list.unshift(item);
    localStorage.setItem(DB_KEYS.WINNER_PAYOUTS, JSON.stringify(list));
    return item;
  }

  // --- Admin Roles & Permissions ---
  getAdminRoles() {
    return JSON.parse(localStorage.getItem(DB_KEYS.ADMIN_ROLES) || '[]');
  }

  saveAdminRole(adminUser) {
    const list = this.getAdminRoles();
    const idx = list.findIndex(a => a.id === adminUser.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...adminUser };
    } else {
      list.push({
        id: 'adm-' + Date.now(),
        lastLogin: 'Never',
        status: 'Active',
        ...adminUser
      });
    }
    localStorage.setItem(DB_KEYS.ADMIN_ROLES, JSON.stringify(list));
    return true;
  }

  deleteAdminRole(id) {
    const list = this.getAdminRoles().filter(a => a.id !== id);
    localStorage.setItem(DB_KEYS.ADMIN_ROLES, JSON.stringify(list));
    return true;
  }

  // --- Carrier Charge Logs ---
  getCarrierCharges() {
    return JSON.parse(localStorage.getItem(DB_KEYS.CARRIER_CHARGES) || '[]');
  }

  // --- Traffic Logs ---
  getTrafficLogs() {
    return JSON.parse(localStorage.getItem(DB_KEYS.TRAFFIC_LOGS) || '[]');
  }

  // --- Contact Groups ---
  getContactGroups() {
    return JSON.parse(localStorage.getItem(DB_KEYS.CONTACT_GROUPS) || '[]');
  }

  saveContactGroup(group) {
    const list = this.getContactGroups();
    const idx = list.findIndex(g => g.id === group.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...group };
    } else {
      list.push({
        id: 'grp-' + Date.now(),
        count: group.count || 0,
        tags: group.tags || ['Custom'],
        ...group
      });
    }
    localStorage.setItem(DB_KEYS.CONTACT_GROUPS, JSON.stringify(list));
    return true;
  }

  deleteContactGroup(id) {
    const list = this.getContactGroups().filter(g => g.id !== id);
    localStorage.setItem(DB_KEYS.CONTACT_GROUPS, JSON.stringify(list));
    return true;
  }

  // --- User Tracking ---
  getUserTracking() {
    return JSON.parse(localStorage.getItem(DB_KEYS.USER_TRACKING) || '[]');
  }
}

// Global instance
window.wapDB = new WAPDatabase();
