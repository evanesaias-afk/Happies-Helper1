import 'dotenv/config';

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const GUILD_ID = process.env.GUILD_ID;
export const SELLER_APPLY_CHANNEL_ID = process.env.SELLER_APPLY_CHANNEL_ID || '';

export function requireEnv() {
  const missing = [];
  if (!DISCORD_TOKEN) missing.push('DISCORD_TOKEN');
  if (!CLIENT_ID) missing.push('CLIENT_ID');
  if (!GUILD_ID) missing.push('GUILD_ID');
  if (missing.length) {
    console.error('❌ Missing env:', missing.join(', '));
    process.exit(1);
  }
}
