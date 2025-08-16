import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ChannelType,
} from 'discord.js';
import { SELLER_APPLY_CHANNEL_ID } from '../config.js';

export const data = new SlashCommandBuilder()
  .setName('applyseller')
  .setDescription('Apply to be a seller (opens a form)');

export const modalId = 'applysellerModal';

export async function execute(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(modalId)
    .setTitle('Seller Application');

  const q1 = new TextInputBuilder()
    .setCustomId('what_sell')
    .setLabel('1) What do you want to sell?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const q2 = new TextInputBuilder()
    .setCustomId('prev_shops')
    .setLabel('2) Sold in shops before? Which ones?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const q3 = new TextInputBuilder()
    .setCustomId('activity')
    .setLabel('3) How active will you be?')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const q4 = new TextInputBuilder()
    .setCustomId('agree_tax')
    .setLabel('4) We charge 25% OOG tax. Do you agree? (Yes/No)')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  modal.addComponents(
    new ActionRowBuilder().addComponents(q1),
    new ActionRowBuilder().addComponents(q2),
    new ActionRowBuilder().addComponents(q3),
    new ActionRowBuilder().addComponents(q4),
  );

  return interaction.showModal(modal);
}

export async function handleModalSubmit(interaction) {
  const sell   = interaction.fields.getTextInputValue('what_sell').slice(0, 1024);
  const prev   = interaction.fields.getTextInputValue('prev_shops').slice(0, 1024);
  const active = interaction.fields.getTextInputValue('activity').slice(0, 1024);
  const agree  = interaction.fields.getTextInputValue('agree_tax').slice(0, 1024);

  const e = new EmbedBuilder()
    .setTitle('📝 New Seller Application')
    .setColor(0x5865F2)
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
      { name: 'Applicant', value: `${interaction.user} (\`${interaction.user.tag}\` · \`${interaction.user.id}\`)` },
      { name: '1) What sell', value: sell || '—' },
      { name: '2) Previous shops', value: prev || '—' },
      { name: '3) Activity', value: active || '—' },
      { name: '4) Agree to 25% OOG tax', value: agree || '—' },
    )
    .setTimestamp();

  try {
    let destChannel = null;
    if (SELLER_APPLY_CHANNEL_ID) {
      destChannel = await interaction.client.channels.fetch(SELLER_APPLY_CHANNEL_ID).catch(() => null);
    }
    if (!destChannel) {
      // Fallback: use the channel where the command was invoked (if it's a guild text channel)
      const ch = await interaction.client.channels.fetch(interaction.channelId).catch(() => null);
      if (ch && (ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildAnnouncement)) {
        destChannel = ch;
      }
    }

    if (destChannel) {
      await destChannel.send({ embeds: [e] });
    }
  } catch (err) {
    console.error('Post application failed:', err);
  }

  return interaction.reply({ content: '✅ Thanks! Your application was submitted. Staff will review it shortly.', ephemeral: true });
}
