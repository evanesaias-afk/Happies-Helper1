// src/config.js — applyseller bot

/* =========================== ENV VARS =========================== */
// use separate env vars so it won’t clash with your main bot
export const DISCORD_TOKEN = process.env.APPLYSELLER_TOKEN || "";
export const CLIENT_ID     = process.env.APPLYSELLER_CLIENT || "";
export const GUILD_ID      = process.env.APPLYSELLER_GUILD || "";

/* =========================== CHANNELS =========================== */
export const SELLER_APPLY_CHANNEL_ID = "1396594120499400807"; // seller application channel

/* =========================== ROLES =========================== */
export const SELLER_ROLE_ID = "1396594120499400807"; // seller role

/* =========================== COLORS =========================== */
export const FT_BLUE = 0x5865F2;

/* =========================== GIFs / MEDIA =========================== */
export const JOB_APP_GIF_URL = "https://media.giphy.com/media/your-job-application.gif";

/* =========================== OTHER =========================== */
export const FT_NAME = "Forgotten Traders";
