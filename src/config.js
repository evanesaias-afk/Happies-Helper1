// src/config.js — central config file

/* =========================== ENV VARS =========================== */
// helper: throw if env var is missing
export function requireEnv(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`❌ Missing required env var: ${name}`);
  }
  return val;
}

// export required env vars (these MUST be set in Render > Environment)
export const DISCORD_TOKEN = requireEnv("DISCORD_TOKEN");
export const CLIENT_ID     = requireEnv("CLIENT_ID");
export const GUILD_ID      = requireEnv("GUILD_ID");

/* =========================== CHANNELS =========================== */
export const REVIEW_CHANNEL_ID       = "1396645204177457274";
export const SCAMMER_CHANNEL_ID      = "1396645074355486913";
export const SELLER_APPLY_CHANNEL_ID = "1396594120499400807";

/* =========================== ROLES =========================== */
export const SCAMMER_ROLE_ID   = "1404359573401370705";
export const SELLER_ROLE_ID    = "1396594120499400807";
export const CLASSIC_ROLE_ID   = "1404316149486714991";
export const VIP_ROLE_ID       = "1404377665766555689";
export const DELUXE_ROLE_ID    = "1404316539057995878";
export const PRESTIGE_ROLE_ID  = "1404316641805734021";
export const TITAN_ROLE_ID     = "1404316734998970378";

/* =========================== COLORS =========================== */
export const FT_BLUE = 0x5865F2;

/* =========================== GIFs / MEDIA =========================== */
// replace with your actual gif links
export const JOB_APP_GIF_URL   = "https://media.giphy.com/media/your-job-application.gif";
export const SCAMMER_GIF_URL   = "https://media.giphy.com/media/perfect-scammer.gif";
export const TAX_GIF_URL       = "https://media.giphy.com/media/tax-reminder.gif";
export const THANK_YOU_GIF_URL = "https://media.giphy.com/media/cat-thank-you.gif";

/* =========================== OTHER =========================== */
export const FT_NAME = "Forgotten Traders";
