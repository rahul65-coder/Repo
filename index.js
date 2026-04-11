// Cloudflare Worker for Telegram Movie Bot - Enhanced Version
// Bot Name: CineVault AI

const BOT_TOKEN = '8192872982:AAEg-FFpyGXWgrIqEIFcCgNYeNq389rGU90';
const ADMIN_ID = 8314195743;
const FIREBASE_DB_URL = "https://web-admin-e297c-default-rtdb.asia-southeast1.firebasedatabase.app";
const BOT_NAME = "🎬 CineVault AI";

// User session storage
const userSessions = new Map();

// Available categories
const CATEGORIES = [
  '🎬 Action', '💕 Romance', '😂 Comedy', '😱 Horror', 
  '🧙 Fantasy', '🚀 Sci-Fi', '🎭 Drama', '🔍 Thriller',
  '🎌 Anime', '📺 Web Series', '🎪 Animation', '⚔️ Adventure'
];

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'POST') {
      const update = await request.json();
      await handleUpdate(update);
      return new Response('OK', { status: 200 });
    }
    return new Response('CineVault AI Bot is running', { status: 200 });
  }
};

async function handleUpdate(update) {
  if (update.message) {
    const message = update.message;
    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text || '';
    
    // Register user if new
    await registerUser(userId, message.from);
    
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
      await showHowToUse(chatId);
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
        await showHowToUse(chatId);
      }
      break;
      
    default:
      await sendMessage(chatId, '❓ Unknown command. Use /help to see available commands.');
  }
}

async function sendUserWelcome(chatId, user) {
  const welcomeText = `
╔══════════════════════╗
║  🎬 ${BOT_NAME}  ║
╚══════════════════════╝

👋 Hello <b>${user.first_name || 'there'}</b>!

🤖 I'm an AI-powered movie & series bot that can provide you with:

🎬 <b>Movies</b> - Millions of titles
🎌 <b>Anime</b> - Latest & classic series
📺 <b>Web Series</b> - Popular shows
🎪 <b>Animations</b> - Family entertainment

━━━━━━━━━━━━━━━━━━━━
<b>🎯 Quick Start:</b>

💬 Simply type any movie name
🔍 Use /browse to explore categories
📊 Check /statistics for your activity
ℹ️ Use /howtouse for detailed guide

━━━━━━━━━━━━━━━━━━━━
<b>⚡ Features:</b>

✨ Instant movie delivery
🎯 Category-based browsing
📊 Personal statistics
🔍 Smart search system
⚡ Lightning-fast responses

<i>Powered by AI • Available 24/7</i>
━━━━━━━━━━━━━━━━━━━━
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔍 Browse Movies', callback_data: 'browse_movies' },
        { text: '📊 My Stats', callback_data: 'my_stats' }
      ],
      [
        { text: 'ℹ️ How to Use', callback_data: 'how_to_use' },
        { text: '👤 My Info', callback_data: 'my_info' }
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

🎯 <b>Hi Boss! Ready for action today!</b>

📊 <b>Current Statistics:</b>
━━━━━━━━━━━━━━━━━━━━━
📽️ Total Movies: <b>${stats.totalMovies}</b>
👥 Total Users: <b>${stats.totalUsers}</b>
📨 Pending Requests: <b>${stats.pendingRequests}</b>
📈 Today's Searches: <b>${stats.todaySearches}</b>

━━━━━━━━━━━━━━━━━━━━━
<b>⚡ Admin Commands:</b>

📤 /add - Upload new movie
📋 /list - View all movies
🗑️ /delete [name] - Remove movie
📨 /requests - View user requests
📢 /broadcast [msg] - Send to all users
👥 /allusers - View all users
📊 /statistics - Detailed stats

━━━━━━━━━━━━━━━━━━━━━
<b>💡 Quick Tips:</b>

• Use /add to upload movies
• Check requests regularly
• Broadcast for announcements
• Monitor user activity

<i>All systems operational ✓</i>
━━━━━━━━━━━━━━━━━━━━━
`;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📤 Add Movie', callback_data: 'admin_add' },
        { text: '📨 Requests', callback_data: 'admin_requests' }
      ],
      [
        { text: '👥 All Users', callback_data: 'admin_users' },
        { text: '📋 Movie List', callback_data: 'admin_list' }
      ]
    ]
  };

  await sendMessage(chatId, welcomeText, { 
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
}

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

  // Create category buttons (2 per row)
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

async function showHowToUse(chatId) {
  const text = `
📚 <b>How to Use ${BOT_NAME}</b>

━━━━━━━━━━━━━━━━━━━━━
<b>🔍 Search for Movies:</b>

Simply type any movie name and I'll find it for you!

<b>Examples:</b>
• <code>Pushpa</code>
• <code>Avatar</code>
• <code>Naruto</code>
• <code>Breaking Bad</code>

━━━━━━━━━━━━━━━━━━━━━
<b>🎯 Browse Categories:</b>

Use /browse to select 2 categories and see popular movies in those genres.

━━━━━━━━━━━━━━━━━━━━━
<b>📨 Request Movies:</b>

If a movie is not found, don't worry! Just type the name and I'll automatically send a request to the admin. They'll add it <b>within 24 hours!</b>

<b>Example:</b>
You search: <code>Inception</code>
If not found, I'll show:

"❌ Movie not found! 
✅ I've requested it from admin
⏰ Will be available within 24 hours"

━━━━━━━━━━━━━━━━━━━━━
<b>📊 Track Your Activity:</b>

• /myinfo - View your profile
• /statistics - See your stats
• /browse - Explore categories

━━━━━━━━━━━━━━━━━━━━━
<b>💡 Tips:</b>

✓ Be specific with movie names
✓ Check spelling carefully
✓ Use /browse for discovery
✓ Request unavailable movies

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
    text += `   🔍 Searches: ${user.totalSearches || 0}\n\n`;
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

━━━━━━━━━━━━━━━━━━━━━
<b>📨 Requests:</b>

/requests - View pending requests
Mark as done or delete from inline buttons

━━━━━━━━━━━━━━━━━━━━━
<b>📊 Statistics:</b>

View real-time stats on /start

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

async function searchAndSendMovie(chatId, movieName, userId, user) {
  try {
    await sendMessage(chatId, '🔍 Searching...');
    
    const movie = await getMovieFromFirebase(movieName.toLowerCase());
    
    if (movie) {
      await sendVideo(chatId, movie.fileId, {
        caption: 
          `🎬 <b>${movie.displayName}</b>\n\n` +
          `📁 ${movie.category1}, ${movie.category2}\n` +
          `📝 ${movie.description}\n` +
          `💾 ${(movie.fileSize / (1024 * 1024)).toFixed(2)} MB\n` +
          `⏱ ${formatDuration(movie.duration)}\n` +
          `👁️ Views: ${movie.views + 1}`,
        parse_mode: 'HTML',
        thumb: movie.thumbnailFileId || undefined
      });
      
      await updateUserActivity(userId, movieName, true);
      await incrementMovieViews(movie.name);
      
    } else {
      // Movie not found - create request
      await createRequest(userId, user, movieName);
      
      await sendMessage(chatId, 
        `❌ <b>Movie "${movieName}" not found!</b>\n\n` +
        `✅ Don't worry! I've sent your request to the admin.\n\n` +
        `⏰ <b>${movieName}</b> will be available within <b>24 hours</b>!\n\n` +
        `📨 You'll be notified once it's added.\n\n` +
        `<i>Thank you for your patience! 🙏</i>`,
        { parse_mode: 'HTML' }
      );
      
      await updateUserActivity(userId, movieName, false);
      
      // Notify admin
      await sendMessage(ADMIN_ID, 
        `📨 <b>New Movie Request!</b>\n\n` +
        `🎬 Movie: <b>${movieName}</b>\n` +
        `👤 User: ${user.first_name} ${user.last_name || ''}\n` +
        `🆔 ID: ${userId}\n\n` +
        `Use /requests to manage`,
        { parse_mode: 'HTML' }
      );
    }
  } catch (error) {
    await sendMessage(chatId, '❌ Error: ' + error.message);
  }
}

async function handleCallbackQuery(callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;
  
  // Answer callback to remove loading
  await answerCallbackQuery(callbackQuery.id);
  
  if (data === 'browse_movies') {
    await showBrowseMenu(chatId, userId);
  } else if (data === 'my_stats') {
    await showUserStatistics(chatId, userId);
  } else if (data === 'how_to_use') {
    await showHowToUse(chatId);
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
  } else if (data.startsWith('req_done_')) {
    const requestId = data.substring(9);
    await markRequestDone(chatId, requestId);
  } else if (data.startsWith('req_del_')) {
    const requestId = data.substring(8);
    await deleteRequest(chatId, requestId);
  }
}

async function handleCategorySelection(chatId, userId, data) {
  const session = userSessions.get(userId) || { state: 'selecting_categories', selected: [] };
  const categoryIndex = parseInt(data.substring(4));
  const category = CATEGORIES[categoryIndex];
  
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
  } else {
    // Update the message with selected categories
    let text = `🎬 <b>Browse Movies</b>\n\n`;
    text += `Selected: ${session.selected.map(i => CATEGORIES[i]).join(', ')}\n`;
    text += `\n<i>Select ${2 - session.selected.length} more...</i>`;
    
    await editMessageText(chatId, callbackQuery.message.message_id, text);
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
    text += `   👁️ ${movie.views} views\n\n`;
  });
  
  text += `\n<i>Type any movie name to watch! 🎬</i>`;
  
  await sendMessage(chatId, text, { parse_mode: 'HTML' });
}

// Firebase & Database Functions
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
    moviesDownloaded: 0
  };
  
  await saveUserToFirebase(userData);
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
    text += `   👁️ ${movie.views || 0} views\n\n`;
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

// Telegram API Functions
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
      supports_streaming: true,
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

// Utility Functions
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