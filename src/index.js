// src/index.js
import 'dotenv/config';
import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  EmbedBuilder 
} from 'discord.js';
import { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } from './config.js';

// ----------------- CLIENT SETUP -----------------
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ----------------- /applyseller COMMAND -----------------
const commands = [
  new SlashCommandBuilder()
    .setName('applyseller')
    .setDescription('Apply to become a seller in Forgotten Traders!')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log('🔄 Refreshing /applyseller command...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('✅ Successfully registered command.');
  } catch (err) {
    console.error('❌ Error registering commands:', err);
  }
}

// ----------------- BOT READY -----------------
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

// ----------------- INTERACTION HANDLER -----------------
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'applyseller') {
    const embed = new EmbedBuilder()
      .setTitle('📜 APPLICATION FOR SELLER')
      .setDescription(
        "Hello! Welcome to **Forgotten Traders**!\n\n" +
        "We strive to give customers the best experience and we’re honored you’d like to sell with us!\n\n" +
        "Please answer the following:\n" +
        "1️⃣ What are you looking to sell? (Bosses, kits, tames, all, etc)\n" +
        "2️⃣ Have you sold in any shops before? If so, which ones?\n" +
        "3️⃣ How often will you be active trading?\n" +
        "4️⃣ We charge 25% of all OOG trades. Do you agree to this?"
      )
      .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

// ----------------- LOGIN -----------------
console.log("DEBUG - Token starts with:", DISCORD_TOKEN?.slice(0, 10));
client.login(DISCORD_TOKEN);

// Register commands when bot starts
registerCommands();
