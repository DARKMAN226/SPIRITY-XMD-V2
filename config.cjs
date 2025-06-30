const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "MAKAMESCO-MD<=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUNhNkd6Uk1RaFF2aEpHeUp1YXJCNVRzS2h4RVVPNWkrazhHVXFaWWUzaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidVl4Q3ZweUlCd01DbjVrUFp2VzAzR1RMbUM0T01CdXc1czRLamdhaUVqYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlT0Mxd01rZFpBK2NJYno0THdtVWtPYW9MR3pDUm0xVDNKdWpoV3FNcDJBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtVUlCT09NTEVMVmJXMGJFd1NLMmVFMjJUVVpCUVZubnV4RDVjWTYwK3hFPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlVQZDIyNitmY29nNk5jUVkzb0Z6NnVQZU5aYXR4RFpoazZob0hOeGcvMWM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImhzRlEzaHpBaUY1eEQySU1wUnlIbnUzY2Q3TVlyam5abGhtTTJGTE1aZ0U9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMk5lQ2tzWEpyTzhNaVoyUFNnbSs0SHlrdFZWL3hNVUFETHlDU2J4TXpVMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYjluaEFmN2c5REh2VjNkbVlZVVBQK0hFd3hBWHExVU1odXRvVnByMEtBOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlpTckxpbXdRS3JGV01QK3RIdEhvWndITFQvWjBzekxhbndIb0cybTVSNWNldXYzZTBzMWVtdmtrUmUwWVU3OVY2OXNJUzdtNlBSc09DeUtjU2doMENnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTY4LCJhZHZTZWNyZXRLZXkiOiIyRG5WbHBVNnA1RlZyVkRvMlZJQm1icndTTlM0RmQzVkJJVHh1K1ppdU9ZPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJDTXhmbUZvZlRwNjU1SnFzdE5xWnJnIiwicGhvbmVJZCI6IjM3YjhlYWE4LTFmNDktNDJkZC04M2FjLWY3MjNjODRlYTI2ZCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxRXFJanY2NDN6c2p3Nk1kWUxHdzFZTkNVdGc9In0sInJlZ2lzdGVyZWQiOmZhbHNlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlkYVUxWHhpS0tFVUpJTXUvZUN6TnFYZktsOD0ifSwicmVnaXN0cmF0aW9uIjp7fSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0tQNGdzTURFTGJ5aWNNR0dHOGdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkFRQmN0ZFllaVN6WkdQMU4wWkV6WmRnc3I3N1pBM0o4dE1KWFc5eU5nVmM9IiwiYWNjb3VudFNpZ25hdHVyZSI6Ik5FTlJHcUliQlE2eUlORHdlUjNHMWdIN1p4Q094bk9XSnl0SDJkdGZ0dEtpRDBMZFZGOWxSVnJoZzk1OUtUNHgrM1R5ZTRod0xmRzc5TWFwSVVaZ0R3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiJqSEhBb3NuaUt3MWdUOHhISkh4RjFaQ1Fqek1EU3NTUnhXdGJVTytOS3Bza050eUxRQlBtMEQ1RGdMaXpqZkl1UGtYdTJCN3d2aW83TGNJUVhBdHhEUT09In0sIm1lIjp7ImlkIjoiMjI2MDM1ODI5MDY6NDZAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiPOKIgs6xz4DOui3iiILOtc69Lz4iLCJsaWQiOiIyMjM0NTQ3NTAwNTIzNjE6NDZAbGlkIn0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIyNjAzNTgyOTA2OjQ2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlFFQVhMWFdIb2tzMlJqOVRkR1JNMlhZTEsrKzJRTnlmTFRDVjF2Y2pZRlgifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBZ0lEUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MTI4NDAzOCwibGFzdFByb3BIYXNoIjoiMkc0QW11IiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFIR3AifQ==",
  PREFIX: process.env.PREFIX || ".",
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === "true" : true,
  AUTO_LIKE: process.env.AUTO_LIKE !== undefined ? process.env.AUTO_LIKE === "true" : true,
  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY !== undefined ? process.env.AUTO_STATUS_REPLY === "true" : false,
  STATUS_READ_MSG: process.env.STATUS_READ_MSG || "",
  ANTI_DELETE: process.env.ANTI_DELETE !== undefined ? process.env.ANTI_DELETE === "true" : false,
  ANTI_DELETE_PATH: process.env.ANTI_DELETE_PATH || "inbox",
  AUTO_DL: process.env.AUTO_DL !== undefined ? process.env.AUTO_DL === "true" : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === "true" : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === "true" : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === "true" : false,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === "true" : true,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === "true" : false,
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === "true" : false,
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === "true" : false,
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === "true" : false,
  MODE: process.env.MODE || "public",
  BOT_NAME: process.env.BOT_NAME || "SPIRITY-XMD",
  MENU_IMAGE: process.env.MENU_IMAGE || "https://files.catbox.moe/fta4xd.jpg",
  DESCRIPTION: process.env.DESCRIPTION || " WhatsApp Bot by DARK-DEV🍷",
  OWNER_NAME: process.env.OWNER_NAME || "DARK-DEV🍷",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "22603582906",
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || "",
  GEMINI_KEY: process.env.GEMINI_KEY || "AIzaSyBNlOwH-t4npZCdyDv98lyyf8MSbhqG4uE",
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === "true" : false,
};

module.exports = config;
