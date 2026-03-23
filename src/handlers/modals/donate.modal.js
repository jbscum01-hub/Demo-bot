const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const env = require('../../config/env');
const { CUSTOM_IDS } = require('../../core/customIds');
const {
  buildDonateRequestEmbed
} = require('../../core/embeds');
const {
  createDonateRequest,
  updateDonateRequestMessageMeta
} = require('../../services/donate.service');
const {
  writeAuditLog,
  sendAuditLogToDiscord
} = require('../../services/audit.service');

async function handleDonateModal(interaction) {
  const amountRaw = interaction.fields.getTextInputValue('amount').trim();
  const amount = Number(amountRaw.replace(/,/g, ''));

  if (!Number.isFinite(amount) || amount <= 0) {
    return interaction.reply({
      content: 'จำนวนเงินไม่ถูกต้อง กรุณากรอกเป็นตัวเลขที่มากกว่า 0',
      ephemeral: true
    });
  }

  const row = await createDonateRequest({
    guildId: interaction.guildId,
    userId: interaction.user.id,
    username: interaction.user.username,
    discordTag: interaction.user.tag,
    playerName: interaction.fields.getTextInputValue('player_name').trim(),
    amount,
    paymentMethod: interaction.fields.getTextInputValue('payment_method').trim(),
    proofUrl: interaction.fields.getTextInputValue('proof_url').trim(),
    note: interaction.fields.getTextInputValue('note').trim()
  });

  const reviewChannel = await interaction.client.channels.fetch(env.DONATE_REVIEW_CHANNEL_ID);

  if (!reviewChannel || !reviewChannel.isTextBased()) {
    throw new Error('[CONFIG_INVALID] DONATE_REVIEW_CHANNEL_ID is not a text channel');
  }

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.APPROVE_DONATE_PREFIX}${row.request_code}`)
      .setLabel('Approve')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.REJECT_DONATE_PREFIX}${row.request_code}`)
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
  );

  const reviewMessage = await reviewChannel.send({
    embeds: [buildDonateRequestEmbed(row)],
    components: [buttons]
  });

  await updateDonateRequestMessageMeta({
    requestCode: row.request_code,
    channelId: reviewMessage.channelId,
    messageId: reviewMessage.id
  });

  await writeAuditLog({
    guildId: interaction.guildId,
    actorId: interaction.user.id,
    actorName: interaction.user.tag,
    actionType: 'DONATE_REQUEST_CREATED',
    targetType: 'DONATE_REQUEST',
    targetId: row.request_code,
    details: {
      amount,
      player_name: row.player_name,
      payment_method: row.payment_method
    }
  });

  await sendAuditLogToDiscord(interaction.client, [
    '📝 **DONATE_REQUEST_CREATED**',
    `Request: \\`${row.request_code}\\``,
    `User: <@${interaction.user.id}>`,
    `Amount: ${amount.toLocaleString()} บาท`
  ]);

  await interaction.reply({
    content: `ส่งคำขอสำเร็จแล้ว ✅\nเลขรายการ: **${row.request_code}**\nแอดมินสามารถไปกด Approve / Reject ในห้องรีวิวได้เลย`,
    ephemeral: true
  });
}

module.exports = { handleDonateModal };
