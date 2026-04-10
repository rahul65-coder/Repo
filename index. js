// Cloudflare Worker for Telegram Movie Bot - Enhanced Version
// Bot Name: OTTStreamGuideBot

const BOT_TOKEN = '8693136180:AAHq-HGuCu1oGZzHpLMaE2gf_NPzQ0DsYVA';
const ADMIN_ID = 8314195743;
const FIREBASE_DB_URL = "https://web-admin-e297c-default-rtdb.asia-southeast1.firebasedatabase.app";
const BOT_NAME = "🎬 OTT Stream Guide";

// User session storage
const userSessions = new Map();

// Available categories
const CATEGORIES = [
  '🎬 Action', '💕 Romance', '😂 Comedy', '😱 Horror', 
  '🧙 Fantasy', '🚀 Sci-Fi', '🎭 Drama', '🔍 Thriller',
  '🎌 Anime', '📺 Web Series', '🎪 Animation', '⚔️ Adventure'
];

// Achievement System
const ACHIEVEMENTS = {
  first_search: { name: '🎯 First Search', points: 10, description: 'Make your first search' },
  movie_watcher: { name: '🍿 Movie Watcher', points: 50, requirement: 10, description: 'Watch 10 movies' },
  cinema_lover: { name: '🎬 Cinema Lover', points: 100, requirement: 50, description: 'Watch 50 movies' },
  critic: { name: '⭐ Critic', points: 30, requirement: 5, description: 'Rate 5 movies' },
  social_butterfly: { name: '🦋 Social Butterfly', points: 40, requirement: 3, description: 'Invite 3 friends' },
  collector: { name: '📚 Collector', points: 60, requirement: 20, description: 'Add 20 to watchlist' },
  early_bird: { name: '🌅 Early Bird', points: 20, requirement: 1, description: 'Use bot before 8 AM' },
  night_owl: { name: '🦉 Night Owl', points: 20, requirement: 1, description: 'Use bot after 11 PM' },
  trivia_master: { name: '🎮 Trivia Master', points: 80, requirement: 10, description: 'Answer 10 trivia correctly' }
};

// Multi-Language Support
const LANGUAGES = {
  en: {
    welcome: 'Welcome to OTT Stream Guide!',
    search: 'Search for movies...',
    not_found: 'Movie not found!',
    browse: 'Browse Movies',
    stats: 'Statistics',
    howto: 'How to Use',
    myinfo: 'My Info',
    trending: '🔥 Trending',
    recommend: '🎯 Recommended',
    watchlist: '📋 Watchlist',
    achievements: '🏆 Achievements',
    trivia: '🎮 Trivia',
    share: '📤 Share',
    invite: '🔗 Invite',
    settings: '⚙️ Settings'
  },
  hi: {
    welcome: 'OTT स्ट्रीम गाइड में आपका स्वागत है!',
    search: 'फिल्में खोजें...',
    not_found: 'फिल्म नहीं मिली!',
    browse: 'फिल्में ब्राउज़ करें',
    stats: 'आंकड़े',
    howto: 'कैसे उपयोग करें',
    myinfo: 'मेरी जानकारी',
    trending: '🔥 ट्रेंडिंग',
    recommend: '🎯 अनुशंसित',
    watchlist: '📋 देखने की सूची',
    achievements: '🏆 उपलब्धियां',
    trivia: '🎮 ट्रिविया',
    share: '📤 शेयर करें',
    invite: '🔗 आमंत्रित करें',
    settings: '⚙️ सेटिंग्स'
  },
  es: {
    welcome: '¡Bienvenido a OTT Stream Guide!',
    search: 'Buscar películas...',
    not_found: '¡Película no encontrada!',
    browse: 'Explorar Películas',
    stats: 'Estadísticas',
    howto: 'Cómo Usar',
    myinfo: 'Mi Información',
    trending: '🔥 Tendencias',
    recommend: '🎯 Recomendado',
    watchlist: '📋 Lista de Ver',
    achievements: '🏆 Logros',
    trivia: '🎮 Trivia',
    share: '📤 Compartir',
    invite: '🔗 Invitar',
    settings: '⚙️ Configuración'
  },
  ta: {
    welcome: 'OTT ஸ்ட்ரீம் கைடுக்கு வரவேற்கிறோம்!',
    search: 'திரைப்படங்களைத் தேடுங்கள்...',
    not_found: 'திரைப்படம் கிடைக்கவில்லை!',
    browse: 'திரைப்படங்களை உலாவுக',
    stats: 'புள்ளிவிவரங்கள்',
    howto: 'எப்படி பயன்படுத்துவது',
    myinfo: 'என் தகவல்',
    trending: '🔥 டிரெண்டிங்',
    recommend: '🎯 பரிந்துரைக்கப்பட்டது',
    watchlist: '📋 பார்க்கும் பட்டியல்',
    achievements: '🏆 சாதனைகள்',
    trivia: '🎮 ட்ரிவியா',
    share: '📤 பகிர்',
    invite: '🔗 அழை',
    settings: '⚙️ அமைப்புகள்'
  },
  te: {
    welcome: 'OTT స్ట్రీమ్ గైడ్‌కి స్వాగతం!',
    search: 'సినిమాలను శోధించండి...',
    not_found: 'సినిమా కనుగొనబడలేదు!',
    browse: 'సినిమాలను బ్రౌజ్ చేయండి',
    stats: 'గణాంకాలు',
    howto: 'ఎలా ఉపయోగించాలి',
    myinfo: 'నా సమాచారం',
    trending: '🔥 ట్రెండింగ్',
    recommend: '🎯 సిఫార్సు చేయబడినవి',
    watchlist: '📋 వాచ్‌లిస్ట్',
    achievements: '🏆 విజయాలు',
    trivia: '🎮 ట్రివియా',
    share: '📤 షేర్',
    invite: '🔗 ఆహ్వానించండి',
    settings: '⚙️ సెట్టింగ్‌లు'
  }
};

// Trivia Questions Database
const TRIVIA_QUESTIONS = [
  {
    question: "Which movie won the Oscar for Best Picture in 2020?",
    options: ["1917", "Parasite", "Joker", "Once Upon a Time in Hollywood"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "Who directed the movie 'Inception'?",
    options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Martin Scorsese"],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "Which actor played Iron Man in the Marvel Cinematic Universe?",
    options: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is the highest-grossing film of all time (as of 2024)?",
    options: ["Avatar", "Avengers: Endgame", "Titanic", "Avatar: The Way of Water"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "Which Indian movie was nominated for Best Foreign Language Film at the 2023 Oscars?",
    options: ["RRR", "The Elephant Whisperers", "All That Breathes", "Last Film Show"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "Who played the Joker in 'The Dark Knight'?",
    options: ["Jack Nicholson", "Heath Ledger", "Jared Leto", "Joaquin Phoenix"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "Which studio produced 'Spirited Away'?",
    options: ["Pixar", "DreamWorks", "Studio Ghibli", "Disney"],
    correct: 2,
    difficulty: "medium"
  },
  {
    question: "In which year was the first 'Star Wars' movie released?",
    options: ["1975", "1977", "1980", "1983"],
    correct: 1,
    difficulty: "medium"
  },
  {
    question: "Who directed 'Baahubali: The Beginning'?",
    options: ["S.S. Rajamouli", "Rajkumar Hirani", "Sanjay Leela Bhansali", "Mani Ratnam"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "Which movie features the character 'Jack Sparrow'?",
    options: ["The Matrix", "Pirates of the Caribbean", "Gladiator", "The Lord of the Rings"],
    correct: 1,
    difficulty: "easy"
  },
  {
    question: "What is the name of the kingdom in 'Frozen'?",
    options: ["Arendelle", "Corona", "Atlantica", "DunBroch"],
    correct: 0,
    difficulty: "medium"
  },
  {
    question: "Who played Neo in 'The Matrix'?",
    options: ["Brad Pitt", "Tom Cruise", "Keanu Reeves", "Johnny Depp"],
    correct: 2,
    difficulty: "easy"
  },
  {
    question: "Which movie won the Palme d'Or at Cannes 2019?",
    options: ["Parasite", "Portrait of a Lady on Fire", "Once Upon a Time in Hollywood", "Pain and Glory"],
    correct: 0,
    difficulty: "hard"
  },
  {
    question: "What is the name of the dragon in 'Mulan'?",
    options: ["Mushu", "Sisu", "Toothless", "Smaug"],
    correct: 0,
    difficulty: "easy"
  },
  {
    question: "Which film features the quote: 'Here's looking at you, kid'?",
    options: ["Gone with the Wind", "Casablanca", "Citizen Kane", "The Godfather"],
    correct: 1,
    difficulty: "hard"
  }
];

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const update = await request.json();
      await handleUpdate(update);
      return new Response('OK', { status: 200 });
    }
    return new Response('OTT Stream Guide Bot is running', { status: 200 });
  }
};

async function handleUpdate(update) {
  if (update.message) {
    const message = update.message;
    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text || '';
    
    // Check for achievement triggers
    await checkTimeBasedAchievements(userId);
    
    // Register user if new
    await registerUser(userId, message.from);
    
    // Handle invite links from /start
    if (text.startsWith('/start') && text.length > 6) {
      const inviteCode = text.substring(7);
      await handleInviteLink(chatId, userId, inviteCode);
    }
    
    // Handle commands
    if (text.startsWith('/')) {
      await handleCommand(chatId, userId, text, message);
    } 
    // Handle video upload from admin
    else if (message.video && userId === ADMIN_ID) {
      await handleVideoUpload(chatId, message);
    }
    // Handle text messages
    else {
      await handleTextMessage(chatId, userId, text, message);
    }
  } else if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
  }
}

async function handleCommand(chatId, userId, command, message) {
  const cmd = command.split(' ')[0].toLowerCase();
  const isAdmin = userId === ADMIN_ID;
  const userLang = await getUserLanguage(userId);
  
  switch (cmd) {
    case '/start':
      if (isAdmin) {
        await sendAdminWelcome(chatId);
      } else {
        await sendUserWelcome(chatId, message.from);
      }
      break;
      
    case '/browse':
      if (isAdmin) return;
      await showBrowseMenu(chatId, userId);
      break;
      
    case '/myinfo':
      if (isAdmin) return;
      await showUserInfo(chatId, userId);
      break;
      
    case '/statistics':
      if (isAdmin) return;
      await showUserStatistics(chatId, userId);
      break;
      
    case '/howtouse':
      if (isAdmin) return;
      await showHowToUse(chatId, userLang);
      break;
      
    case '/trending':
      await showTrendingMovies(chatId);
      break;
      
    case '/recommend':
      if (isAdmin) return;
      await showRecommendations(chatId, userId);
      break;
      
    case '/watchlist':
      if (isAdmin) return;
      await showWatchlist(chatId, userId);
      break;
      
    case '/achievements':
      if (isAdmin) return;
      await showAchievements(chatId, userId);
      break;
      
    case '/trivia':
      if (isAdmin) return;
      await startTrivia(chatId, userId);
      break;
      
    case '/share':
      if (isAdmin) return;
      const movieToShare = command.substring(7).trim();
      if (!movieToShare) {
        await sendMessage(chatId, '❌ Usage: /share MovieName');
        return;
      }
      await initiateShare(chatId, userId, movieToShare);
      break;
      
    case '/invite':
      if (isAdmin) return;
      await generateInviteLink(chatId, userId);
      break;
      
    case '/language':
      await showLanguageMenu(chatId, userId);
      break;
      
    case '/search':
      if (isAdmin) return;
      await advancedSearch(chatId, userId);
      break;
      
    case '/settings':
      await showSettings(chatId, userId);
      break;
      
    case '/add':
      if (!isAdmin) {
        await sendMessage(chatId, '❌ This command is only for admins.');
        return;
      }
      userSessions.set(userId, { state: 'awaiting_movie' });
      await sendMessage(chatId, 
        '📤 <b>Upload Movie</b>\n\n' +
        'Send video with caption:\n' +
        '<code>MovieName | Category1 | Category2 | Description</code>\n\n' +
        '📝 Example:\n' +
        '<code>Pushpa | Action | Drama | A laborer rises through the ranks of a red sandalwood smuggling syndicate.</code>',
        { parse_mode: 'HTML' }
      );
      break;
      
    case '/requests':
      if (!isAdmin) return;
      await showRequests(chatId);
      break;
      
    case '/broadcast':
      if (!isAdmin) return;
      const broadcastMsg = command.substring(11).trim();
      if (!broadcastMsg) {
        await sendMessage(chatId, '❌ Please provide a message to broadcast.\n\nUsage: /broadcast Your message here');
        return;
      }
      await broadcastMessage(chatId, broadcastMsg);
      break;
      
    case '/allusers':
      if (!isAdmin) return;
      await showAllUsers(chatId);
      break;
      
    case '/list':
      if (!isAdmin) return;
      await listMovies(chatId);
      break;
      
    case '/analytics':
      if (!isAdmin) return;
      await showDetailedAnalytics(chatId);
      break;
      
    case '/delete':
      if (!isAdmin) return;
      const movieToDelete = command.substring(8).trim();
      if (!movieToDelete) {
        await sendMessage(chatId, '❌ Usage: /delete MovieName');
        return;
      }
      await deleteMovie(chatId, movieToDelete);
      break;
      
    case '/help':
      if (isAdmin) {
        await showAdminHelp(chatId);
      } else {
        await showHowToUse(chatId, userLang);
      }
      break;
      
    default:
      await sendMessage(chatId, '❓ Unknown command. Use /help to see available commands.');
  }
}

// ============= NEW FEATURE FUNCTIONS =============

// 1. Trending Movies System
async function showTrendingMovies(chatId) {
  const movies = await getAllMoviesFromFirebase();
  const trending = movies
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
  
  if (trending.length === 0) {
    await sendMessage(chatId, '📋 No movies available yet!');
    return;
  }
  
  let text = `🔥 <b>Trending This Week</b>\n\n`;
  
  trending.forEach((movie, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    text += `${medal} <b>${movie.displayName}</b>\n`;
    text += `   👁️ ${movie.views || 0} views | ⭐ ${movie.rating?.average || 'N/A'}\n`;
    text += `   📁 ${movie.category1}, ${movie.category2}\n\n`;
  });
  
  const keyboard = {
    inline_keyboard: trending.map((movie) => [{
      text: `🎬 Watch ${movie.displayName}`,
      callback_data: `play_${encodeURIComponent(movie.name)}`
    }])
  };
  
  keyboard.inline_keyboard.push([{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]);
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

// 2. Rating System
async function handleRating(chatId, userId, movieName, rating) {
  const decodedMovieName = decodeURIComponent(movieName);
  const movie = await getMovieFromFirebase(decodedMovieName);
  if (!movie) return;
  
  const ratingData = {
    userId,
    movieName: decodedMovieName,
    rating: parseInt(rating),
    timestamp: Date.now()
  };
  
  const url = `${FIREBASE_DB_URL}/ratings/${encodeURIComponent(decodedMovieName)}/${userId}.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ratingData)
  });
  
  await updateMovieRating(decodedMovieName);
  await updateUserRatingsCount(userId);
  
  // Check achievement
  await checkAchievements(userId);
  
  await sendMessage(chatId, `✅ You rated "${movie.displayName}" ${rating} stars!`);
  await answerCallbackQuery(callbackQueryId, 'Rating saved!');
}

async function updateMovieRating(movieName) {
  const ratingsUrl = `${FIREBASE_DB_URL}/ratings/${encodeURIComponent(movieName)}.json`;
  const response = await fetch(ratingsUrl);
  const ratings = await response.json();
  
  if (!ratings) return;
  
  const values = Object.values(ratings);
  const avgRating = values.reduce((sum, r) => sum + r.rating, 0) / values.length;
  
  const url = `${FIREBASE_DB_URL}/movies/${encodeURIComponent(movieName)}/rating.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      average: avgRating.toFixed(1),
      count: values.length
    })
  });
}

async function updateUserRatingsCount(userId) {
  const user = await getUserInfo(userId);
  const url = `${FIREBASE_DB_URL}/users/${userId}/ratingsCount.json`;
  const currentCount = user.ratingsCount || 0;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentCount + 1)
  });
}

// 3. Watchlist System
async function addToWatchlist(userId, movieName) {
  const watchlistUrl = `${FIREBASE_DB_URL}/watchlist/${userId}/${encodeURIComponent(movieName)}.json`;
  await fetch(watchlistUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      movieName,
      addedAt: Date.now()
    })
  });
  
  // Update watchlist count for achievements
  const watchlist = await getUserWatchlist(userId);
  const countUrl = `${FIREBASE_DB_URL}/users/${userId}/watchlistCount.json`;
  await fetch(countUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(watchlist.length)
  });
}

async function getUserWatchlist(userId) {
  const url = `${FIREBASE_DB_URL}/watchlist/${userId}.json`;
  const response = await fetch(url);
  const watchlist = await response.json();
  return watchlist ? Object.values(watchlist) : [];
}

async function showWatchlist(chatId, userId) {
  const watchlist = await getUserWatchlist(userId);
  
  if (watchlist.length === 0) {
    await sendMessage(chatId, '📋 Your watchlist is empty!\n\nUse /browse to add movies to your watchlist.');
    return;
  }
  
  let text = `📋 <b>Your Watchlist (${watchlist.length})</b>\n\n`;
  const keyboard = { inline_keyboard: [] };
  
  for (const item of watchlist.slice(0, 10)) {
    const movie = await getMovieFromFirebase(item.movieName);
    text += `🎬 <b>${item.movieName}</b>\n`;
    text += `   📅 Added: ${new Date(item.addedAt).toLocaleDateString()}\n\n`;
    
    if (movie) {
      keyboard.inline_keyboard.push([{
        text: `🎬 Watch ${item.movieName}`,
        callback_data: `play_${encodeURIComponent(item.movieName)}`
      }]);
    }
  }
  
  keyboard.inline_keyboard.push([{ text: '🗑️ Clear Watchlist', callback_data: 'clear_watchlist' }]);
  keyboard.inline_keyboard.push([{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]);
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

async function removeFromWatchlist(userId, movieName) {
  const url = `${FIREBASE_DB_URL}/watchlist/${userId}/${encodeURIComponent(movieName)}.json`;
  await fetch(url, { method: 'DELETE' });
}

// 4. Smart Recommendations
async function getUserWatchHistory(userId) {
  const url = `${FIREBASE_DB_URL}/history/${userId}.json`;
  const response = await fetch(url);
  const history = await response.json();
  return history ? Object.values(history) : [];
}

async function showRecommendations(chatId, userId) {
  await sendMessage(chatId, '🎯 <b>Finding perfect movies for you...</b>', { parse_mode: 'HTML' });
  
  const watchHistory = await getUserWatchHistory(userId);
  const allMovies = await getAllMoviesFromFirebase();
  
  let recommendations = [];
  
  if (watchHistory.length === 0) {
    // New user - recommend trending
    recommendations = allMovies
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  } else {
    // Find favorite categories
    const categoryCount = {};
    watchHistory.forEach(movie => {
      categoryCount[movie.category1] = (categoryCount[movie.category1] || 0) + 1;
      categoryCount[movie.category2] = (categoryCount[movie.category2] || 0) + 1;
    });
    
    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Filter recommendations
    recommendations = allMovies
      .filter(movie => 
        !watchHistory.find(w => w.name === movie.name) &&
        (topCategories.includes(movie.category1) || topCategories.includes(movie.category2))
      )
      .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
      .slice(0, 5);
  }
  
  if (recommendations.length === 0) {
    await sendMessage(chatId, '🎬 No recommendations available. Try browsing categories!');
    return;
  }
  
  let text = `🎯 <b>Recommended For You</b>\n\n`;
  text += `Based on your watching habits\n\n`;
  
  const keyboard = { inline_keyboard: [] };
  
  recommendations.forEach((movie, index) => {
    text += `${index + 1}. <b>${movie.displayName}</b>\n`;
    text += `   📁 ${movie.category1}, ${movie.category2}\n`;
    text += `   ⭐ ${movie.rating?.average || 'N/A'} | 👁️ ${movie.views || 0} views\n\n`;
    
    keyboard.inline_keyboard.push([{
      text: `🎬 Watch ${movie.displayName}`,
      callback_data: `play_${encodeURIComponent(movie.name)}`
    }]);
  });
  
  keyboard.inline_keyboard.push([{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]);
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

// 5. Advanced Analytics Dashboard
async function showDetailedAnalytics(chatId) {
  const movies = await getAllMoviesFromFirebase();
  const users = await getAllUsers();
  const requests = await getAllRequests();
  
  const totalViews = movies.reduce((sum, m) => sum + (m.views || 0), 0);
  const avgRating = movies.length > 0 
    ? movies.reduce((sum, m) => sum + (parseFloat(m.rating?.average) || 0), 0) / movies.length 
    : 0;
  
  const activeUsers = users.filter(u => {
    const lastActive = new Date(u.lastActive);
    const daysSinceActive = (Date.now() - lastActive) / (1000 * 60 * 60 * 24);
    return daysSinceActive <= 7;
  }).length;
  
  const categoryViews = {};
  movies.forEach(m => {
    categoryViews[m.category1] = (categoryViews[m.category1] || 0) + (m.views || 0);
    categoryViews[m.category2] = (categoryViews[m.category2] || 0) + (m.views || 0);
  });
  
  const sortedCategories = Object.entries(categoryViews)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const mostViewed = movies.sort((a,b) => (b.views||0) - (a.views||0))[0];
  const bestRated = movies.sort((a,b) => (parseFloat(b.rating?.average)||0) - (parseFloat(a.rating?.average)||0))[0];
  
  const todayViews = await getTodayViews();
  const todayNewUsers = await getTodayNewUsers();
  
  const text = `
📊 <b>Advanced Analytics Dashboard</b>

━━━━━━━━━━━━━━━━━━━━━
<b>📈 Overview:</b>
• Total Movies: ${movies.length}
• Total Views: ${totalViews.toLocaleString()}
• Avg Rating: ${avgRating.toFixed(1)} ⭐
• Total Users: ${users.length}
• Active Users (7d): ${activeUsers}

<b>🎯 Top Performing:</b>
• Most Viewed: ${mostViewed?.displayName || 'N/A'} (${mostViewed?.views || 0} views)
• Best Rated: ${bestRated?.displayName || 'N/A'} (${bestRated?.rating?.average || 'N/A'}⭐)

<b>📁 Top Categories:</b>
${sortedCategories.map((c, i) => `• ${c[0]}: ${c[1]} views`).join('\n')}

<b>📅 Daily Stats:</b>
• Today's Views: ${todayViews}
• New Users Today: ${todayNewUsers}
• Pending Requests: ${requests.length}

<b>👥 User Engagement:</b>
• Avg Searches/User: ${(users.reduce((s, u) => s + (u.totalSearches || 0), 0) / users.length).toFixed(1)}
• Retention Rate: ${((activeUsers / users.length) * 100).toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📊 Export Report', callback_data: 'export_analytics' }],
      [{ text: '🔙 Back', callback_data: 'admin_back' }]
    ]
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

async function getTodayViews() {
  const url = `${FIREBASE_DB_URL}/stats/todayViews.json`;
  const response = await fetch(url);
  return await response.json() || 0;
}

async function getTodayNewUsers() {
  const url = `${FIREBASE_DB_URL}/stats/todayNewUsers.json`;
  const response = await fetch(url);
  return await response.json() || 0;
}

async function incrementTodayViews() {
  const current = await getTodayViews();
  const url = `${FIREBASE_DB_URL}/stats/todayViews.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(current + 1)
  });
}

// 6. Trivia Game System
async function startTrivia(chatId, userId) {
  const question = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
  
  userSessions.set(userId, {
    state: 'playing_trivia',
    question: question,
    score: 0,
    streak: 0,
    questionCount: 0
  });
  
  const text = `
🎮 <b>Movie Trivia!</b>

📊 Difficulty: ${getDifficultyEmoji(question.difficulty)} ${question.difficulty}

❓ <b>${question.question}</b>

<i>Choose the correct answer:</i>
`;

  const keyboard = {
    inline_keyboard: question.options.map((opt, i) => [{
      text: opt,
      callback_data: `trivia_${i}`
    }])
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

function getDifficultyEmoji(difficulty) {
  switch(difficulty) {
    case 'easy': return '🟢';
    case 'medium': return '🟡';
    case 'hard': return '🔴';
    default: return '⚪';
  }
}

async function handleTriviaAnswer(chatId, userId, answerIndex, callbackQuery) {
  const session = userSessions.get(userId);
  if (!session || session.state !== 'playing_trivia') {
    await answerCallbackQuery(callbackQuery.id, 'Session expired! Start a new game with /trivia');
    return;
  }
  
  const isCorrect = answerIndex === session.question.correct;
  let response = '';
  
  if (isCorrect) {
    session.score += 10;
    session.streak++;
    
    if (session.streak >= 3) {
      session.score += 5;
      response = '🔥 STREAK BONUS! +5 points!\n';
    }
    
    response = `✅ Correct! +10 points!\n${response}`;
  } else {
    session.streak = 0;
    const correctAnswer = session.question.options[session.question.correct];
    response = `❌ Wrong! The correct answer was: ${correctAnswer}\n`;
  }
  
  session.questionCount++;
  
  // Update user trivia stats
  await updateUserTriviaStats(userId, isCorrect);
  
  if (session.questionCount >= 5) {
    // End game
    const totalScore = session.score;
    userSessions.delete(userId);
    
    await updateUserTotalTriviaScore(userId, totalScore);
    await checkAchievements(userId);
    
    const finalText = `
🎮 <b>Game Over!</b>

🏆 Final Score: <b>${totalScore}</b>
✅ Correct: ${session.streak} streak
📊 Total Questions: 5

${totalScore >= 40 ? '🌟 Excellent! You\'re a movie expert!' : 
  totalScore >= 25 ? '👍 Good job! Keep watching movies!' : 
  '📚 Keep learning! Try again!'}

Play again with /trivia
`;
    
    await sendMessage(chatId, finalText, { parse_mode: 'HTML' });
    await answerCallbackQuery(callbackQuery.id, `Game Over! Score: ${totalScore}`);
    return;
  }
  
  // Next question
  const newQuestion = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
  session.question = newQuestion;
  userSessions.set(userId, session);
  
  const nextText = `
${response}

🎮 <b>Question ${session.questionCount + 1}/5</b>
📊 Score: ${session.score} | Streak: ${session.streak}🔥
📊 Difficulty: ${getDifficultyEmoji(newQuestion.difficulty)} ${newQuestion.difficulty}

❓ <b>${newQuestion.question}</b>
`;

  const keyboard = {
    inline_keyboard: newQuestion.options.map((opt, i) => [{
      text: opt,
      callback_data: `trivia_${i}`
    }])
  };
  
  await editMessageText(chatId, callbackQuery.message.message_id, nextText, { reply_markup: keyboard });
  await answerCallbackQuery(callbackQuery.id, isCorrect ? '✅ Correct!' : '❌ Wrong!');
}

async function updateUserTriviaStats(userId, isCorrect) {
  const user = await getUserInfo(userId);
  const trivia = user.trivia || { correct: 0, total: 0 };
  
  trivia.total++;
  if (isCorrect) trivia.correct++;
  
  const url = `${FIREBASE_DB_URL}/users/${userId}/trivia.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trivia)
  });
}

async function updateUserTotalTriviaScore(userId, score) {
  const user = await getUserInfo(userId);
  const currentScore = user.triviaScore || 0;
  
  const url = `${FIREBASE_DB_URL}/users/${userId}/triviaScore.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentScore + score)
  });
}

// 7. Social Features - Share & Invite
async function initiateShare(chatId, userId, movieName) {
  const movie = await getMovieFromFirebase(movieName.toLowerCase());
  
  if (!movie) {
    await sendMessage(chatId, `❌ Movie "${movieName}" not found.`);
    return;
  }
  
  const shareText = `
📤 <b>Share this movie</b>

Forward this message to your friends!

🎬 <b>${movie.displayName}</b>
📁 ${movie.category1}, ${movie.category2}
⭐ Rating: ${movie.rating?.average || 'N/A'}/5
📝 ${movie.description}

<i>Watch now on @OTTStreamGuideBot! 🍿</i>
`;

  await sendMessage(chatId, shareText, { parse_mode: 'HTML' });
}

async function generateInviteLink(chatId, userId) {
  const inviteCode = generateUniqueCode(userId);
  
  const url = `${FIREBASE_DB_URL}/invites/${inviteCode}.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      createdBy: userId,
      createdAt: Date.now(),
      uses: 0,
      usedBy: []
    })
  });
  
  const botUsername = 'OTTStreamGuideBot';
  const inviteLink = `https://t.me/${botUsername}?start=${inviteCode}`;
  
  const text = `
🔗 <b>Your Invite Link</b>

<code>${inviteLink}</code>

━━━━━━━━━━━━━━━━━━━━━
<b>🎁 Rewards:</b>
• +20 points per friend who joins
• Unlock Social Butterfly achievement
• Special badges

Share this link with friends!
`;

  const keyboard = {
    inline_keyboard: [[
      { text: '📤 Share Link', switch_inline_query: inviteLink }
    ]]
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

function generateUniqueCode(userId) {
  return `${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

async function handleInviteLink(chatId, userId, inviteCode) {
  const url = `${FIREBASE_DB_URL}/invites/${inviteCode}.json`;
  const response = await fetch(url);
  const invite = await response.json();
  
  if (!invite) return;
  
  // Check if already used by this user
  if (invite.usedBy && invite.usedBy.includes(userId)) return;
  
  // Update invite uses
  const usedBy = invite.usedBy || [];
  usedBy.push(userId);
  
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      uses: (invite.uses || 0) + 1,
      usedBy: usedBy
    })
  });
  
  // Award points to inviter
  const inviterId = invite.createdBy;
  await awardPoints(inviterId, 20);
  
  // Notify inviter
  await sendMessage(inviterId, 
    `🎉 <b>Someone joined using your invite!</b>\n\n` +
    `💰 +20 points added to your account!`,
    { parse_mode: 'HTML' }
  );
  
  // Check achievement for inviter
  await checkAchievements(inviterId);
}

async function awardPoints(userId, points) {
  const user = await getUserInfo(userId);
  const currentPoints = user.points || 0;
  
  const url = `${FIREBASE_DB_URL}/users/${userId}/points.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currentPoints + points)
  });
}

// 8. Achievement System
async function checkAchievements(userId) {
  const user = await getUserInfo(userId);
  const stats = await getUserStatistics(userId);
  const achievements = user.achievements || [];
  const watchlist = await getUserWatchlist(userId);
  const invites = await getUserInviteCount(userId);
  
  const newAchievements = [];
  
  // Check each achievement
  if (!achievements.includes('first_search') && stats.totalSearches >= 1) {
    newAchievements.push('first_search');
  }
  
  if (!achievements.includes('movie_watcher') && stats.moviesDownloaded >= 10) {
    newAchievements.push('movie_watcher');
  }
  
  if (!achievements.includes('cinema_lover') && stats.moviesDownloaded >= 50) {
    newAchievements.push('cinema_lover');
  }
  
  if (!achievements.includes('critic') && (user.ratingsCount || 0) >= 5) {
    newAchievements.push('critic');
  }
  
  if (!achievements.includes('social_butterfly') && invites >= 3) {
    newAchievements.push('social_butterfly');
  }
  
  if (!achievements.includes('collector') && watchlist.length >= 20) {
    newAchievements.push('collector');
  }
  
  if (!achievements.includes('trivia_master') && (user.trivia?.correct || 0) >= 10) {
    newAchievements.push('trivia_master');
  }
  
  if (newAchievements.length > 0) {
    const updatedAchievements = [...achievements, ...newAchievements];
    const totalPoints = newAchievements.reduce((sum, a) => sum + ACHIEVEMENTS[a].points, 0);
    
    await updateUserAchievements(userId, updatedAchievements, totalPoints);
    
    return newAchievements;
  }
  
  return [];
}

async function updateUserAchievements(userId, achievements, points) {
  const user = await getUserInfo(userId);
  const currentPoints = user.points || 0;
  
  const url = `${FIREBASE_DB_URL}/users/${userId}.json`;
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      achievements: achievements,
      points: currentPoints + points
    })
  });
}

async function showAchievements(chatId, userId) {
  const user = await getUserInfo(userId);
  const achievements = user.achievements || [];
  const points = user.points || 0;
  const invites = await getUserInviteCount(userId);
  
  let text = `🏆 <b>Your Achievements</b>\n\n`;
  text += `💰 Total Points: <b>${points}</b>\n`;
  text += `📊 Progress: ${achievements.length}/${Object.keys(ACHIEVEMENTS).length} unlocked\n\n`;
  text += `<b>Unlocked:</b>\n`;
  
  Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
    const unlocked = achievements.includes(key);
    text += `${unlocked ? '✅' : '🔒'} ${achievement.name} (${achievement.points} pts)\n`;
    if (!unlocked && achievement.requirement) {
      text += `   └ Progress: ${getAchievementProgress(userId, key)}/${achievement.requirement}\n`;
    }
  });
  
  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `<i>Keep using the bot to unlock more achievements!</i>`;
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '📊 View Stats', callback_data: 'my_stats' }],
      [{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]
    ]
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

function getAchievementProgress(userId, achievementKey) {
  // This would fetch the actual progress from user data
  return '?';
}

async function getUserInviteCount(userId) {
  const url = `${FIREBASE_DB_URL}/invites.json`;
  const response = await fetch(url);
  const invites = await response.json();
  
  if (!invites) return 0;
  
  return Object.values(invites).filter(i => i.createdBy === userId)
    .reduce((sum, i) => sum + (i.uses || 0), 0);
}

async function checkTimeBasedAchievements(userId) {
  const hour = new Date().getHours();
  const user = await getUserInfo(userId);
  const achievements = user.achievements || [];
  const newAchievements = [];
  
  if (!achievements.includes('early_bird') && hour < 8) {
    newAchievements.push('early_bird');
  }
  
  if (!achievements.includes('night_owl') && hour >= 23) {
    newAchievements.push('night_owl');
  }
  
  if (newAchievements.length > 0) {
    const updatedAchievements = [...achievements, ...newAchievements];
    const totalPoints = newAchievements.reduce((sum, a) => sum + ACHIEVEMENTS[a].points, 0);
    await updateUserAchievements(userId, updatedAchievements, totalPoints);
  }
}

// 9. Multi-Language Support
async function getUserLanguage(userId) {
  const user = await getUserInfo(userId);
  return user?.language || 'en';
}

function t(userLang, key) {
  return LANGUAGES[userLang]?.[key] || LANGUAGES.en[key] || key;
}

async function setLanguage(chatId, userId, lang) {
  const url = `${FIREBASE_DB_URL}/users/${userId}/language.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lang)
  });
  
  await sendMessage(chatId, `✅ Language set to ${lang.toUpperCase()}`);
}

async function showLanguageMenu(chatId, userId) {
  const text = `
🌐 <b>Select Language / भाषा चुनें / Idioma</b>

Choose your preferred language:
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🇬🇧 English', callback_data: 'lang_en' }],
      [{ text: '🇮🇳 हिंदी', callback_data: 'lang_hi' }],
      [{ text: '🇪🇸 Español', callback_data: 'lang_es' }],
      [{ text: '🇮🇳 தமிழ்', callback_data: 'lang_ta' }],
      [{ text: '🇮🇳 తెలుగు', callback_data: 'lang_te' }],
      [{ text: '🔙 Back', callback_data: 'back_to_menu' }]
    ]
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

// 10. Advanced Search
async function advancedSearch(chatId, userId) {
  userSessions.set(userId, { 
    state: 'advanced_search',
    filters: {
      categories: [],
      year: null,
      rating: null,
      language: null
    }
  });
  
  let text = `
🔍 <b>Advanced Search</b>

<b>Current Filters:</b>
• Categories: Any
• Year: Any
• Rating: Any
• Language: Any

Select filter to modify:
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '📁 Categories', callback_data: 'filter_categories' }, { text: '📅 Year', callback_data: 'filter_year' }],
      [{ text: '⭐ Rating', callback_data: 'filter_rating' }, { text: '🌐 Language', callback_data: 'filter_lang' }],
      [{ text: '🔍 Search', callback_data: 'filter_search' }, { text: '🔄 Reset', callback_data: 'filter_reset' }],
      [{ text: '❌ Cancel', callback_data: 'back_to_menu' }]
    ]
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

async function applyAdvancedSearch(chatId, userId) {
  const session = userSessions.get(userId);
  if (!session || session.state !== 'advanced_search') return;
  
  const filters = session.filters;
  let movies = await getAllMoviesFromFirebase();
  
  // Apply filters
  if (filters.categories && filters.categories.length > 0) {
    movies = movies.filter(m => 
      filters.categories.includes(m.category1) || filters.categories.includes(m.category2)
    );
  }
  
  if (filters.rating) {
    movies = movies.filter(m => (m.rating?.average || 0) >= filters.rating);
  }
  
  if (filters.language) {
    movies = movies.filter(m => m.language === filters.language);
  }
  
  if (movies.length === 0) {
    await sendMessage(chatId, '❌ No movies found with these filters.');
    userSessions.delete(userId);
    return;
  }
  
  let text = `🔍 <b>Search Results (${movies.length})</b>\n\n`;
  
  movies.slice(0, 10).forEach((movie, index) => {
    text += `${index + 1}. <b>${movie.displayName}</b>\n`;
    text += `   📁 ${movie.category1}, ${movie.category2}\n`;
    text += `   ⭐ ${movie.rating?.average || 'N/A'} | 👁️ ${movie.views || 0}\n\n`;
  });
  
  if (movies.length > 10) {
    text += `<i>... and ${movies.length - 10} more movies</i>`;
  }
  
  const keyboard = {
    inline_keyboard: movies.slice(0, 5).map(m => [{
      text: `🎬 Watch ${m.displayName}`,
      callback_data: `play_${encodeURIComponent(m.name)}`
    }])
  };
  
  keyboard.inline_keyboard.push([{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]);
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
  userSessions.delete(userId);
}

// 11. Settings Menu
async function showSettings(chatId, userId) {
  const user = await getUserInfo(userId);
  const notifications = user.notifications !== false;
  
  const text = `
⚙️ <b>Settings</b>

<b>Current Settings:</b>
• Language: ${user.language || 'English'}
• Notifications: ${notifications ? '✅ On' : '❌ Off'}
• Privacy Mode: ${user.private ? '✅ On' : '❌ Off'}

Select an option to change:
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🌐 Change Language', callback_data: 'settings_lang' }],
      [{ text: `${notifications ? '🔕' : '🔔'} Toggle Notifications`, callback_data: 'settings_notify' }],
      [{ text: '🔒 Toggle Privacy', callback_data: 'settings_privacy' }],
      [{ text: '📊 Export My Data', callback_data: 'settings_export' }],
      [{ text: '🔙 Back', callback_data: 'back_to_menu' }]
    ]
  };
  
  await sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: keyboard });
}

async function toggleNotifications(chatId, userId) {
  const user = await getUserInfo(userId);
  const newValue = user.notifications === false ? true : false;
  
  const url = `${FIREBASE_DB_URL}/users/${userId}/notifications.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newValue)
  });
  
  await sendMessage(chatId, `✅ Notifications ${newValue ? 'enabled' : 'disabled'}!`);
}

// ============= UPDATED FUNCTIONS =============

async function sendUserWelcome(chatId, user) {
  const welcomeText = `
╔══════════════════════╗
║  🎬 ${BOT_NAME}  ║
╚══════════════════════╝

👋 Hello <b>${user.first_name || 'there'}</b>!

🤖 I'm an AI-powered movie & series bot with new features!

🎬 <b>Movies</b> • 🎌 <b>Anime</b> • 📺 <b>Web Series</b>

━━━━━━━━━━━━━━━━━━━━
<b>🎯 Quick Start:</b>

💬 Type any movie name
🔥 /trending - See what's hot
🎯 /recommend - Get personalized picks
📋 /watchlist - Save for later
🏆 /achievements - Earn rewards
🎮 /trivia - Play & win points
📤 /share - Share with friends
🔗 /invite - Invite & earn points
⚙️ /settings - Customize

━━━━━━━━━━━━━━━━━━━━
<i>Powered by AI • Available 24/7</i>
━━━━━━━━━━━━━━━━━━━━
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔥 Trending', callback_data: 'trending_movies' },
        { text: '🎯 Recommended', callback_data: 'recommended_movies' }
      ],
      [
        { text: '📋 Watchlist', callback_data: 'view_watchlist' },
        { text: '🏆 Achievements', callback_data: 'view_achievements' }
      ],
      [
        { text: '🔍 Browse', callback_data: 'browse_movies' },
        { text: '📊 My Stats', callback_data: 'my_stats' }
      ],
      [
        { text: '🎮 Trivia', callback_data: 'play_trivia' },
        { text: '⚙️ Settings', callback_data: 'open_settings' }
      ]
    ]
  };

  await sendMessage(chatId, welcomeText, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function sendAdminWelcome(chatId) {
  const stats = await getAdminStats();
  
  const welcomeText = `
╔═══════════════════════╗
║  👑 ADMIN DASHBOARD  ║
╚═══════════════════════╝

🎯 <b>Welcome Boss! Enhanced Dashboard</b>

📊 <b>Quick Stats:</b>
━━━━━━━━━━━━━━━━━━━━━
📽️ Total Movies: <b>${stats.totalMovies}</b>
👥 Total Users: <b>${stats.totalUsers}</b>
📨 Pending Requests: <b>${stats.pendingRequests}</b>

━━━━━━━━━━━━━━━━━━━━━
<b>⚡ Admin Commands:</b>

📤 /add - Upload movie
📋 /list - View movies
📊 /analytics - Detailed analytics
📨 /requests - View requests
📢 /broadcast - Announce
👥 /allusers - User list

━━━━━━━━━━━━━━━━━━━━━
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📤 Add Movie', callback_data: 'admin_add' },
        { text: '📊 Analytics', callback_data: 'admin_analytics' }
      ],
      [
        { text: '📨 Requests', callback_data: 'admin_requests' },
        { text: '👥 Users', callback_data: 'admin_users' }
      ],
      [
        { text: '📋 Movie List', callback_data: 'admin_list' }
      ]
    ]
  };

  await sendMessage(chatId, welcomeText, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function searchAndSendMovie(chatId, movieName, userId, user) {
  try {
    await sendMessage(chatId, '🔍 Searching...');
    
    const movie = await getMovieFromFirebase(movieName.toLowerCase());
    
    if (movie) {
      // Add to watch history
      await addToWatchHistory(userId, movie);
      
      // Check achievements
      const newAchievements = await checkAchievements(userId);
      
      // Rating keyboard
      const ratingKeyboard = {
        inline_keyboard: [[
          { text: '⭐', callback_data: `rate_${encodeURIComponent(movie.name)}_1` },
          { text: '⭐⭐', callback_data: `rate_${encodeURIComponent(movie.name)}_2` },
          { text: '⭐⭐⭐', callback_data: `rate_${encodeURIComponent(movie.name)}_3` },
          { text: '⭐⭐⭐⭐', callback_data: `rate_${encodeURIComponent(movie.name)}_4` },
          { text: '⭐⭐⭐⭐⭐', callback_data: `rate_${encodeURIComponent(movie.name)}_5` }
        ], [
          { text: '📋 Add to Watchlist', callback_data: `watchlist_add_${encodeURIComponent(movie.name)}` },
          { text: '📤 Share', callback_data: `share_${encodeURIComponent(movie.name)}` }
        ]]
      };
      
      await sendVideo(chatId, movie.fileId, {
        caption: 
          `🎬 <b>${movie.displayName}</b>\n\n` +
          `📁 ${movie.category1}, ${movie.category2}\n` +
          `📝 ${movie.description}\n` +
          `💾 ${(movie.fileSize / (1024 * 1024)).toFixed(2)} MB\n` +
          `⏱ ${formatDuration(movie.duration)}\n` +
          `⭐ ${movie.rating?.average || 'N/A'}/5 (${movie.rating?.count || 0} ratings)\n` +
          `👁️ Views: ${movie.views + 1}`,
        parse_mode: 'HTML',
        reply_markup: ratingKeyboard
      });
      
      await updateUserActivity(userId, movieName, true);
      await incrementMovieViews(movie.name);
      await incrementTodayViews();
      
      // Notify about new achievements
      if (newAchievements && newAchievements.length > 0) {
        const achievementNames = newAchievements.map(a => ACHIEVEMENTS[a].name).join(', ');
        const pointsEarned = newAchievements.reduce((sum, a) => sum + ACHIEVEMENTS[a].points, 0);
        
        await sendMessage(chatId, 
          `🎉 <b>Achievement Unlocked!</b>\n\n` +
          `${achievementNames}\n` +
          `💰 +${pointsEarned} points!\n\n` +
          `Check /achievements to see all your achievements!`,
          { parse_mode: 'HTML' }
        );
      }
      
    } else {
      // Movie not found - create request
      await createRequest(userId, user, movieName);
      
      await sendMessage(chatId, 
        `❌ <b>Movie "${movieName}" not found!</b>\n\n` +
        `✅ Request sent to admin.\n` +
        `⏰ Available within 24 hours!`,
        { parse_mode: 'HTML' }
      );
      
      await updateUserActivity(userId, movieName, false);
      
      // Notify admin
      await sendMessage(ADMIN_ID, 
        `📨 <b>New Movie Request!</b>\n\n` +
        `🎬 Movie: <b>${movieName}</b>\n` +
        `👤 User: ${user.first_name} ${user.last_name || ''}\n` +
        `🆔 ID: ${userId}`,
        { parse_mode: 'HTML' }
      );
    }
  } catch (error) {
    await sendMessage(chatId, '❌ Error: ' + error.message);
  }
}

async function addToWatchHistory(userId, movie) {
  const historyUrl = `${FIREBASE_DB_URL}/history/${userId}/${encodeURIComponent(movie.name)}.json`;
  await fetch(historyUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: movie.name,
      displayName: movie.displayName,
      category1: movie.category1,
      category2: movie.category2,
      watchedAt: Date.now()
    })
  });
}

// ============= UPDATED CALLBACK HANDLER =============

async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;
  
  await answerCallbackQuery(callbackQuery.id);
  
  // New feature callbacks
  if (data === 'trending_movies') {
    await showTrendingMovies(chatId);
  } else if (data === 'recommended_movies') {
    await showRecommendations(chatId, userId);
  } else if (data === 'view_watchlist') {
    await showWatchlist(chatId, userId);
  } else if (data === 'view_achievements') {
    await showAchievements(chatId, userId);
  } else if (data === 'play_trivia') {
    await startTrivia(chatId, userId);
  } else if (data === 'open_settings') {
    await showSettings(chatId, userId);
  } else if (data === 'admin_analytics') {
    await showDetailedAnalytics(chatId);
  } else if (data.startsWith('trivia_')) {
    const answerIndex = parseInt(data.substring(7));
    await handleTriviaAnswer(chatId, userId, answerIndex, callbackQuery);
  } else if (data.startsWith('rate_')) {
    const parts = data.split('_');
    const movieName = parts[1];
    const rating = parts[2];
    await handleRating(chatId, userId, movieName, rating);
  } else if (data.startsWith('watchlist_add_')) {
    const movieName = decodeURIComponent(data.substring(14));
    await addToWatchlist(userId, movieName);
    await sendMessage(chatId, `✅ "${movieName}" added to your watchlist!`);
  } else if (data.startsWith('play_')) {
    const movieName = decodeURIComponent(data.substring(5));
    const movie = await getMovieFromFirebase(movieName);
    if (movie) {
      await sendVideo(chatId, movie.fileId, {
        caption: `🎬 <b>${movie.displayName}</b>\n\n📁 ${movie.category1}, ${movie.category2}`,
        parse_mode: 'HTML'
      });
      await incrementMovieViews(movie.name);
    }
  } else if (data.startsWith('share_')) {
    const movieName = decodeURIComponent(data.substring(6));
    await initiateShare(chatId, userId, movieName);
  } else if (data === 'clear_watchlist') {
    const url = `${FIREBASE_DB_URL}/watchlist/${userId}.json`;
    await fetch(url, { method: 'DELETE' });
    await sendMessage(chatId, '✅ Watchlist cleared!');
  } else if (data.startsWith('lang_')) {
    const lang = data.substring(5);
    await setLanguage(chatId, userId, lang);
  } else if (data === 'filter_search') {
    await applyAdvancedSearch(chatId, userId);
  } else if (data === 'filter_reset') {
    userSessions.delete(userId);
    await advancedSearch(chatId, userId);
  } else if (data === 'settings_notify') {
    await toggleNotifications(chatId, userId);
    await showSettings(chatId, userId);
  } else if (data === 'settings_lang') {
    await showLanguageMenu(chatId, userId);
  } else if (data === 'settings_privacy') {
    const user = await getUserInfo(userId);
    const url = `${FIREBASE_DB_URL}/users/${userId}/private.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(!user.private)
    });
    await sendMessage(chatId, `✅ Privacy mode ${!user.private ? 'enabled' : 'disabled'}!`);
    await showSettings(chatId, userId);
  } else if (data === 'settings_export') {
    const user = await getUserInfo(userId);
    const exportData = JSON.stringify(user, null, 2);
    await sendMessage(chatId, `<b>Your Data:</b>\n\n<code>${exportData.substring(0, 3000)}</code>`, { parse_mode: 'HTML' });
  }
  // Original callbacks
  else if (data === 'browse_movies') {
    await showBrowseMenu(chatId, userId);
  } else if (data === 'my_stats') {
    await showUserStatistics(chatId, userId);
  } else if (data === 'how_to_use') {
    await showHowToUse(chatId, 'en');
  } else if (data === 'my_info') {
    await showUserInfo(chatId, userId);
  } else if (data === 'back_to_menu') {
    await sendUserWelcome(chatId, callbackQuery.from);
  } else if (data.startsWith('cat_')) {
    await handleCategorySelection(chatId, userId, data);
  } else if (data === 'admin_add') {
    await handleCommand(chatId, userId, '/add', callbackQuery.message);
  } else if (data === 'admin_requests') {
    await showRequests(chatId);
  } else if (data === 'admin_users') {
    await showAllUsers(chatId);
  } else if (data === 'admin_list') {
    await listMovies(chatId);
  } else if (data === 'admin_back') {
    await sendAdminWelcome(chatId);
  } else if (data.startsWith('req_done_')) {
    const requestId = data.substring(9);
    await markRequestDone(chatId, requestId);
  } else if (data.startsWith('req_del_')) {
    const requestId = data.substring(8);
    await deleteRequest(chatId, requestId);
  }
}

// ============= ORIGINAL FUNCTIONS (Keep all existing functions below) =============

async function showBrowseMenu(chatId, userId) {
  userSessions.set(userId, { state: 'selecting_categories', selected: [] });
  
  const text = `
🎬 <b>Browse Movies by Category</b>

📂 Please select <b>2 categories</b> to see popular movies:

<i>Tap on the categories below 👇</i>
`;

  const keyboard = {
    inline_keyboard: []
  };

  for (let i = 0; i < CATEGORIES.length; i += 2) {
    const row = [];
    row.push({ text: CATEGORIES[i], callback_data: `cat_${i}` });
    if (i + 1 < CATEGORIES.length) {
      row.push({ text: CATEGORIES[i + 1], callback_data: `cat_${i + 1}` });
    }
    keyboard.inline_keyboard.push(row);
  }

  await sendMessage(chatId, text, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showUserInfo(chatId, userId) {
  const userInfo = await getUserInfo(userId);
  
  const text = `
👤 <b>Your Information</b>

━━━━━━━━━━━━━━━━━━━━━
<b>📋 Profile Details:</b>

🆔 User ID: <code>${userId}</code>
👤 Name: ${userInfo.firstName} ${userInfo.lastName || ''}
🌐 Language: ${userInfo.language || 'en'}
📅 Joined: ${new Date(userInfo.registeredAt).toLocaleDateString()}

<b>📊 Activity:</b>

🔍 Total Searches: ${userInfo.totalSearches || 0}
📥 Movies Downloaded: ${userInfo.moviesDownloaded || 0}
⭐ Favorite Category: ${userInfo.favoriteCategory || 'None'}
🕒 Last Active: ${new Date(userInfo.lastActive).toLocaleString()}

<b>🏆 Achievements:</b>
${(userInfo.achievements || []).length} unlocked • ${userInfo.points || 0} points

━━━━━━━━━━━━━━━━━━━━━
<i>Keep watching! 🎬</i>
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]
    ]
  };

  await sendMessage(chatId, text, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showUserStatistics(chatId, userId) {
  const stats = await getUserStatistics(userId);
  
  const text = `
📊 <b>Your Statistics</b>

━━━━━━━━━━━━━━━━━━━━━
<b>📈 Overall Activity:</b>

🔍 Total Searches: <b>${stats.totalSearches}</b>
✅ Successful Finds: <b>${stats.successfulSearches}</b>
❌ Not Found: <b>${stats.failedSearches}</b>
📥 Movies Downloaded: <b>${stats.moviesDownloaded}</b>

<b>📅 This Month:</b>

🔍 Searches: <b>${stats.monthSearches}</b>
📥 Downloads: <b>${stats.monthDownloads}</b>

<b>⭐ Your Preferences:</b>

💫 Most Searched: <i>${stats.mostSearched || 'N/A'}</i>
📂 Favorite Category: <i>${stats.favoriteCategory || 'N/A'}</i>

<b>🏆 Achievements:</b>

${stats.totalSearches >= 50 ? '✅' : '⬜'} Movie Explorer (50 searches)
${stats.moviesDownloaded >= 20 ? '✅' : '⬜'} Cinema Lover (20 downloads)
${stats.totalSearches >= 100 ? '✅' : '⬜'} Movie Master (100 searches)

━━━━━━━━━━━━━━━━━━━━━
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]
    ]
  };

  await sendMessage(chatId, text, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showHowToUse(chatId, userLang) {
  const text = `
📚 <b>How to Use ${BOT_NAME}</b>

━━━━━━━━━━━━━━━━━━━━━
<b>🔍 Search for Movies:</b>

Simply type any movie name and I'll find it for you!

<b>Examples:</b>
• <code>Pushpa</code>
• <code>Avatar</code>
• <code>Naruto</code>

━━━━━━━━━━━━━━━━━━━━━
<b>🎯 Browse Categories:</b>

Use /browse to select categories and see popular movies.

━━━━━━━━━━━━━━━━━━━━━
<b>🔥 New Features:</b>

• /trending - See what's popular
• /recommend - Get AI recommendations
• /watchlist - Save movies to watch later
• /achievements - Unlock rewards
• /trivia - Play and earn points
• /share - Share movies with friends
• /invite - Invite friends & earn

━━━━━━━━━━━━━━━━━━━━━
<b>📨 Request Movies:</b>

If a movie is not found, just type the name and I'll request it from admin. Available within 24 hours!

━━━━━━━━━━━━━━━━━━━━━
<i>Enjoy unlimited entertainment! 🎬</i>
`;

  const keyboard = {
    inline_keyboard: [
      [{ text: '🔍 Try Searching', callback_data: 'try_search' }],
      [{ text: '🔙 Back to Menu', callback_data: 'back_to_menu' }]
    ]
  };

  await sendMessage(chatId, text, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function showRequests(chatId) {
  const requests = await getAllRequests();
  
  if (requests.length === 0) {
    await sendMessage(chatId, '📨 <b>No pending requests</b>\n\nAll caught up! 🎉', { parse_mode: 'HTML' });
    return;
  }
  
  let text = `📨 <b>User Requests (${requests.length})</b>\n\n`;
  
  const keyboard = { inline_keyboard: [] };
  
  requests.forEach((req, index) => {
    text += `${index + 1}. <b>${req.movieName}</b>\n`;
    text += `   👤 User: ${req.userName} (ID: ${req.userId})\n`;
    text += `   📅 ${new Date(req.timestamp).toLocaleString()}\n`;
    text += `   📊 Requests: ${req.count}x\n\n`;
    
    keyboard.inline_keyboard.push([
      { text: `✅ Mark "${req.movieName}" Done`, callback_data: `req_done_${req.requestId}` },
      { text: '🗑️ Delete', callback_data: `req_del_${req.requestId}` }
    ]);
  });
  
  await sendMessage(chatId, text, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

async function broadcastMessage(chatId, message) {
  const users = await getAllUsers();
  let successCount = 0;
  let failCount = 0;
  
  await sendMessage(chatId, `📢 Broadcasting to ${users.length} users...`);
  
  const broadcastText = `
╔════════════════════╗
║  📢 ANNOUNCEMENT  ║
╚════════════════════╝

${message}

━━━━━━━━━━━━━━━━
<i>From: ${BOT_NAME} Admin</i>
`;
  
  for (const user of users) {
    try {
      await sendMessage(user.userId, broadcastText, { parse_mode: 'HTML' });
      successCount++;
    } catch (error) {
      failCount++;
    }
  }
  
  await sendMessage(chatId, 
    `✅ <b>Broadcast Complete!</b>\n\n` +
    `✓ Sent: ${successCount}\n` +
    `✗ Failed: ${failCount}`,
    { parse_mode: 'HTML' }
  );
}

async function showAllUsers(chatId) {
  const users = await getAllUsers();
  
  let text = `👥 <b>All Users (${users.length})</b>\n\n`;
  
  users.slice(0, 50).forEach((user, index) => {
    text += `${index + 1}. ${user.firstName} ${user.lastName || ''}\n`;
    text += `   🆔 ${user.userId}\n`;
    text += `   📅 ${new Date(user.registeredAt).toLocaleDateString()}\n`;
    text += `   🔍 Searches: ${user.totalSearches || 0}\n`;
    text += `   🏆 Achievements: ${(user.achievements || []).length}\n\n`;
  });
  
  if (users.length > 50) {
    text += `\n<i>... and ${users.length - 50} more users</i>`;
  }
  
  await sendMessage(chatId, text, { parse_mode: 'HTML' });
}

async function showAdminHelp(chatId) {
  const text = `
👑 <b>Admin Commands Guide</b>

━━━━━━━━━━━━━━━━━━━━━
<b>📤 Movie Management:</b>

/add - Upload new movie
/list - View all movies
/delete [name] - Remove movie

━━━━━━━━━━━━━━━━━━━━━
<b>👥 User Management:</b>

/allusers - View all users
/broadcast [msg] - Send message to all
/analytics - Detailed analytics

━━━━━━━━━━━━━━━━━━━━━
<b>📨 Requests:</b>

/requests - View pending requests
Mark as done or delete from inline buttons

━━━━━━━━━━━━━━━━━━━━━
`;

  await sendMessage(chatId, text, { parse_mode: 'HTML' });
}

async function handleVideoUpload(chatId, message) {
  const caption = message.caption || '';
  const session = userSessions.get(message.from.id);
  
  if (!session || session.state !== 'awaiting_movie') {
    await sendMessage(chatId, '❌ Please use /add command first.');
    return;
  }
  
  const parts = caption.split('|').map(p => p.trim());
  
  if (parts.length < 4) {
    await sendMessage(chatId, 
      '❌ Invalid format!\n\n' +
      'Use: <code>MovieName | Category1 | Category2 | Description</code>',
      { parse_mode: 'HTML' }
    );
    return;
  }
  
  const [movieName, category1, category2, description] = parts;
  const video = message.video;
  
  const movieData = {
    name: movieName.toLowerCase(),
    displayName: movieName,
    category1,
    category2,
    description,
    fileId: video.file_id,
    fileUniqueId: video.file_unique_id,
    fileName: video.file_name || 'video.mp4',
    fileSize: video.file_size,
    duration: video.duration,
    width: video.width,
    height: video.height,
    thumbnailFileId: video.thumb ? video.thumb.file_id : null,
    uploadedBy: message.from.id,
    uploadedAt: Date.now(),
    views: 0
  };
  
  try {
    await saveMovieToFirebase(movieData);
    userSessions.delete(message.from.id);
    
    await sendMessage(chatId, 
      `✅ <b>Movie Added Successfully!</b>\n\n` +
      `🎬 ${movieData.displayName}\n` +
      `📁 ${category1}, ${category2}\n` +
      `💾 ${(movieData.fileSize / (1024 * 1024)).toFixed(2)} MB\n` +
      `⏱ ${formatDuration(movieData.duration)}`,
      { parse_mode: 'HTML' }
    );
  } catch (error) {
    await sendMessage(chatId, '❌ Error: ' + error.message);
  }
}

async function handleTextMessage(chatId, userId, text, message) {
  if (userId === ADMIN_ID) {
    const session = userSessions.get(userId);
    if (session && session.state === 'awaiting_movie') {
      await sendMessage(chatId, '📤 Please upload the video file.');
      return;
    }
  }
  
  if (text.trim()) {
    await searchAndSendMovie(chatId, text.trim(), userId, message.from);
  }
}

async function handleCategorySelection(chatId, userId, data) {
  const session = userSessions.get(userId) || { state: 'selecting_categories', selected: [] };
  const categoryIndex = parseInt(data.substring(4));
  
  if (session.selected.includes(categoryIndex)) {
    session.selected = session.selected.filter(i => i !== categoryIndex);
  } else {
    if (session.selected.length >= 2) {
      await sendMessage(chatId, '⚠️ You can only select 2 categories. Please deselect one first.');
      return;
    }
    session.selected.push(categoryIndex);
  }
  
  userSessions.set(userId, session);
  
  if (session.selected.length === 2) {
    const cat1 = CATEGORIES[session.selected[0]];
    const cat2 = CATEGORIES[session.selected[1]];
    await showMoviesByCategories(chatId, cat1, cat2);
    userSessions.delete(userId);
  }
}

async function showMoviesByCategories(chatId, cat1, cat2) {
  const movies = await getMoviesByCategories(cat1, cat2);
  
  if (movies.length === 0) {
    await sendMessage(chatId, 
      `❌ No movies found in categories:\n${cat1}, ${cat2}\n\n` +
      `Try other categories!`
    );
    return;
  }
  
  let text = `🎬 <b>Popular in ${cat1} & ${cat2}</b>\n\n`;
  
  movies.slice(0, 10).forEach((movie, index) => {
    text += `${index + 1}. <b>${movie.displayName}</b>\n`;
    text += `   📁 ${movie.category1}, ${movie.category2}\n`;
    text += `   ⭐ ${movie.rating?.average || 'N/A'} | 👁️ ${movie.views} views\n\n`;
  });
  
  text += `\n<i>Type any movie name to watch! 🎬</i>`;
  
  await sendMessage(chatId, text, { parse_mode: 'HTML' });
}

// ============= DATABASE FUNCTIONS =============

async function registerUser(userId, user) {
  const existing = await getUserInfo(userId);
  if (existing) {
    await updateLastActive(userId);
    return;
  }
  
  const userData = {
    userId,
    firstName: user.first_name,
    lastName: user.last_name || '',
    username: user.username || '',
    language: user.language_code || 'en',
    registeredAt: Date.now(),
    lastActive: Date.now(),
    totalSearches: 0,
    moviesDownloaded: 0,
    achievements: [],
    points: 0,
    ratingsCount: 0,
    trivia: { correct: 0, total: 0 },
    triviaScore: 0,
    notifications: true,
    private: false
  };
  
  await saveUserToFirebase(userData);
  
  // Increment new users count
  const todayNewUsers = await getTodayNewUsers();
  const url = `${FIREBASE_DB_URL}/stats/todayNewUsers.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todayNewUsers + 1)
  });
}

async function saveUserToFirebase(userData) {
  const url = `${FIREBASE_DB_URL}/users/${userData.userId}.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
}

async function getUserInfo(userId) {
  const url = `${FIREBASE_DB_URL}/users/${userId}.json`;
  const response = await fetch(url);
  return await response.json();
}

async function updateLastActive(userId) {
  const url = `${FIREBASE_DB_URL}/users/${userId}/lastActive.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Date.now())
  });
}

async function updateUserActivity(userId, movieName, success) {
  const user = await getUserInfo(userId);
  if (!user) return;
  
  const updates = {
    totalSearches: (user.totalSearches || 0) + 1,
    lastActive: Date.now()
  };
  
  if (success) {
    updates.moviesDownloaded = (user.moviesDownloaded || 0) + 1;
  }
  
  const url = `${FIREBASE_DB_URL}/users/${userId}.json`;
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
}

async function getUserStatistics(userId) {
  const user = await getUserInfo(userId);
  if (!user) return {
    totalSearches: 0,
    successfulSearches: 0,
    failedSearches: 0,
    moviesDownloaded: 0,
    monthSearches: 0,
    monthDownloads: 0
  };
  
  return {
    totalSearches: user.totalSearches || 0,
    successfulSearches: user.moviesDownloaded || 0,
    failedSearches: (user.totalSearches || 0) - (user.moviesDownloaded || 0),
    moviesDownloaded: user.moviesDownloaded || 0,
    monthSearches: user.monthSearches || 0,
    monthDownloads: user.monthDownloads || 0,
    mostSearched: user.mostSearched || 'N/A',
    favoriteCategory: user.favoriteCategory || 'N/A'
  };
}

async function getAllUsers() {
  const url = `${FIREBASE_DB_URL}/users.json`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data) return [];
  return Object.values(data);
}

async function createRequest(userId, user, movieName) {
  const requestId = `req_${Date.now()}_${userId}`;
  const requestData = {
    requestId,
    userId,
    userName: `${user.first_name} ${user.last_name || ''}`,
    movieName,
    timestamp: Date.now(),
    count: 1,
    status: 'pending'
  };
  
  const url = `${FIREBASE_DB_URL}/requests/${requestId}.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
}

async function getAllRequests() {
  const url = `${FIREBASE_DB_URL}/requests.json`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data) return [];
  return Object.values(data).filter(r => r.status === 'pending');
}

async function markRequestDone(chatId, requestId) {
  const url = `${FIREBASE_DB_URL}/requests/${requestId}/status.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify('done')
  });
  
  await sendMessage(chatId, '✅ Request marked as done!');
  await showRequests(chatId);
}

async function deleteRequest(chatId, requestId) {
  const url = `${FIREBASE_DB_URL}/requests/${requestId}.json`;
  await fetch(url, { method: 'DELETE' });
  
  await sendMessage(chatId, '🗑️ Request deleted!');
  await showRequests(chatId);
}

async function getAdminStats() {
  const moviesUrl = `${FIREBASE_DB_URL}/movies.json`;
  const usersUrl = `${FIREBASE_DB_URL}/users.json`;
  const requestsUrl = `${FIREBASE_DB_URL}/requests.json`;
  
  const [moviesRes, usersRes, requestsRes] = await Promise.all([
    fetch(moviesUrl),
    fetch(usersUrl),
    fetch(requestsUrl)
  ]);
  
  const movies = await moviesRes.json();
  const users = await usersRes.json();
  const requests = await requestsRes.json();
  
  const totalMovies = movies ? Object.keys(movies).length : 0;
  const totalUsers = users ? Object.keys(users).length : 0;
  const pendingRequests = requests ? Object.values(requests).filter(r => r.status === 'pending').length : 0;
  
  return {
    totalMovies,
    totalUsers,
    pendingRequests,
    todaySearches: 0
  };
}

async function saveMovieToFirebase(movieData) {
  const url = `${FIREBASE_DB_URL}/movies/${encodeURIComponent(movieData.name)}.json`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData)
  });
  if (!response.ok) throw new Error('Failed to save movie');
  return await response.json();
}

async function getMovieFromFirebase(movieName) {
  const url = `${FIREBASE_DB_URL}/movies/${encodeURIComponent(movieName)}.json`;
  const response = await fetch(url);
  if (!response.ok) return null;
  return await response.json();
}

async function getAllMoviesFromFirebase() {
  const url = `${FIREBASE_DB_URL}/movies.json`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data) return [];
  return Object.values(data);
}

async function getMoviesByCategories(cat1, cat2) {
  const allMovies = await getAllMoviesFromFirebase();
  return allMovies
    .filter(m => m.category1 === cat1 || m.category2 === cat1 || m.category1 === cat2 || m.category2 === cat2)
    .sort((a, b) => (b.views || 0) - (a.views || 0));
}

async function deleteMovieFromFirebase(movieName) {
  const url = `${FIREBASE_DB_URL}/movies/${encodeURIComponent(movieName)}.json`;
  await fetch(url, { method: 'DELETE' });
}

async function incrementMovieViews(movieName) {
  const movie = await getMovieFromFirebase(movieName);
  if (!movie) return;
  
  const url = `${FIREBASE_DB_URL}/movies/${encodeURIComponent(movieName)}/views.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify((movie.views || 0) + 1)
  });
}

async function listMovies(chatId) {
  const movies = await getAllMoviesFromFirebase();
  
  if (movies.length === 0) {
    await sendMessage(chatId, '📋 No movies yet. Use /add to upload!');
    return;
  }
  
  let text = `📋 <b>All Movies (${movies.length})</b>\n\n`;
  
  movies.forEach((movie, index) => {
    text += `${index + 1}. <b>${movie.displayName}</b>\n`;
    text += `   📁 ${movie.category1}, ${movie.category2}\n`;
    text += `   💾 ${(movie.fileSize / (1024 * 1024)).toFixed(2)} MB\n`;
    text += `   ⭐ ${movie.rating?.average || 'N/A'} | 👁️ ${movie.views || 0} views\n\n`;
  });
  
  if (text.length > 4000) {
    const messages = splitMessage(text, 4000);
    for (const msg of messages) {
      await sendMessage(chatId, msg, { parse_mode: 'HTML' });
    }
  } else {
    await sendMessage(chatId, text, { parse_mode: 'HTML' });
  }
}

async function deleteMovie(chatId, movieName) {
  const movie = await getMovieFromFirebase(movieName.toLowerCase());
  if (!movie) {
    await sendMessage(chatId, `❌ Movie "${movieName}" not found.`);
    return;
  }
  
  await deleteMovieFromFirebase(movieName.toLowerCase());
  await sendMessage(chatId, `✅ "${movie.displayName}" deleted!`, { parse_mode: 'HTML' });
}

// ============= TELEGRAM API FUNCTIONS =============

async function sendMessage(chatId, text, options = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      ...options
    })
  });
  return await response.json();
}

async function sendVideo(chatId, fileId, options = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      video: fileId,
      ...options
    })
  });
  return await response.json();
}

async function answerCallbackQuery(callbackQueryId, text = '') {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text
    })
  });
}

async function editMessageText(chatId, messageId, text, options = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: 'HTML',
      ...options
    })
  });
}

// ============= UTILITY FUNCTIONS =============

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m ${secs}s`;
}

function splitMessage(text, maxLength) {
  const messages = [];
  let current = '';
  const lines = text.split('\n');
  
  for (const line of lines) {
    if ((current + line + '\n').length > maxLength) {
      messages.push(current);
      current = line + '\n';
    } else {
      current += line + '\n';
    }
  }
  
  if (current) messages.push(current);
  return messages;
}