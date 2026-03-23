const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
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
const { ensureDonateFlowReady } = require('../../services/feature-guard.service');

async function handleDonateModal(interaction) {
  const amountRaw = interaction.fields.getTextInputValue('amount').trim();
  const amount = Number(amountRaw.replace(/,/g, ''));

  if (!Number.isFinite(amount) || amount <= 0) {
    return interaction.reply({
      content: 'จำนวนเงินไม่ถูกต้อง กรุณากรอกเป็นตัวเลขที่มากกว่า 0',
      flags: 64
    });
  }

  await interaction.deferReply({ flags: 64 });

  try {
    const config = await ensureDonateFlowReady(interaction.guildId);

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

    const reviewChannel = await interaction.client.channels.fetch(config.DONATE_REVIEW_CHANNEL_ID);

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

    await sendAuditLogToDiscord(interaction.client, interaction.guildId, [
      '📝 **DONATE_REQUEST_CREATED**',
      `Request: \`${row.request_code}\``,
      `User: <@${interaction.user.id}>`,
      `Amount: ${amount.toLocaleString()} บาท`
    ]);

    await interaction.editReply({
      content: `ส่งคำขอสำเร็จแล้ว ✅\nเลขรายการ: **${row.request_code}**\nแอดมินสามารถไปกด Approve / Reject ในห้องรีวิวได้เลย`
    });
  } catch (error) {
    await interaction.editReply({
      content: error.message?.startsWith('[TENANT_CONFIG_MISSING]')
        ? 'ยังตั้งค่าห้องไม่ครบ ใช้ `!setup-review-donate` และ `!setup-log` ก่อน'
        : error.message?.startsWith('[MODULE_DISABLED]')
          ? 'โมดูล Donate ยังไม่เปิดใช้งานสำหรับเซิร์ฟเวอร์นี้'
          : 'เกิดข้อผิดพลาดในระบบ กรุณาลองอีกครั้ง'
    });
    throw error;
  }
}

module.exports = { handleDonateModal };
