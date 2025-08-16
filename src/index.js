import { Client, GatewayIntentBits, REST, Routes, Collection, ActivityType } from 'discord.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, requireEnv } from './config.js';

requireEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Load commands dynamically from ./commands
const commands = new Collection();
const commandJSON = [];
const modalHandlers = new Map();

const commandsDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsDir)) {
  if (!file.endsWith('.js')) continue;
  const mod = await import(path.join(commandsDir, file));
  if (mod?.data && mod?.execute) {
    commands.set(mod.data.name, mod);
    commandJSON.push(mod.data.toJSON());
  }
  if (mod?.modalId && typeof mod?.handleModalSubmit === 'function') {
    modalHandlers.set(mod.modalId, mod.handleModalSubmit);
  }
}

// --- Register slash commands (guild-scoped for fast updates)
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
async function registerCommands() {
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandJSON });
  console.log(`✅ Registered ${commandJSON.length} command(s) for guild ${GUILD_ID}.`);
}

// --- Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: '/applyseller', type: ActivityType.Listening }],
    status: 'online',
  });
  try { await registerCommands(); } catch (e) { console.error('Register error:', e); }
});

client.on('interactionCreate', async (interaction) => {
  try {
    // Modal submit routing
    if (interaction.isModalSubmit()) {
      const handler = modalHandlers.get(interaction.customId);
      if (handler) return handler(interaction);
      return;
    }

    if (!interaction.isChatInputCommand()) return;
    const cmd = commands.get(interaction.commandName);
    if (!cmd) return interaction.reply({ content: '❔ Command not found.', ephemeral: true });
    await cmd.execute(interaction);
  } catch (err) {
    console.error('Interaction error:', err);
    const msg = '❌ Something went wrong.';
    if (interaction.deferred || interaction.replied) {
      try { await interaction.editReply({ content: msg }); } catch {}
    } else {
      try { await interaction.reply({ content: msg, ephemeral: true }); } catch {}
    }
  }
});

client.login(DISCORD_TOKEN).catch(err => {
  console.error('Login failed:', err);
  process.exit(1);
});
