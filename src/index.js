// src/index.js — Applyseller Bot

import { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } from './config.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  REST,
  Routes,
} from 'discord.js';

// resolve filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize client ---
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

// --- Load commands dynamically from ./commands ---
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
  if (mod?.modalId && typeof mod.handleModalSubmit === 'function') {
    modalHandlers.set(mod.modalId, mod.handleModalSubmit);
  }
}

// --- Register slash commands (guild-scoped for fast updates) ---
const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function registerCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commandJSON }
    );
    console.log('✅ Successfully registered slash commands.');
  } catch (err) {
    console.error('❌ Failed to register commands:', err);
  }
}

// --- Client Ready ---
client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  registerCommands();
});

// --- Handle interactions ---
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
    }
  }

  if (interaction.isModalSubmit()) {
    const handler = modalHandlers.get(interaction.customId);
    if (!handler) return;
    try {
      await handler(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Error handling modal.', ephemeral: true });
    }
  }
});

// --- Log in ---
client.login(DISCORD_TOKEN);
