const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { CUSTOM_IDS } = require('../../core/customIds');
const { buildSupportRequestEmbed } = require('../../core/embeds');
const { createSupportRequest, updateSupportRequestMessageMeta } = require('../../services/support.service');
const { writeAuditLog, sendAuditLogToDiscord } = require('../../services/audit.service');
const { ensureSupportFlowReady } = require('../../services/feature-guard.service');

async function handleSupportModal(interaction) {
  await interaction.deferReply({ flags: 64 });

  try {
    const config = await ensureSupportFlowReady(interaction.guildId);

    const row = await createSupportRequest({
      guildId: interaction.guildId,
      userId: interaction.user.id,
      username: interaction.user.username,
      discordTag: interaction.user.tag,
      playerName: interaction.fields.getTextInputValue('player_name').trim(),
      topic: interaction.fields.getTextInputValue('topic').trim(),
      detailText: interaction.fields.getTextInputValue('detail').trim(),
      contactText: interaction.fields.getTextInputValue('contact').trim()
    });

    const reviewChannel = await interaction.client.channels.fetch(config.SUPPORT_REVIEW_CHANNEL_ID);
    if (!reviewChannel || !reviewChannel.isTextBased()) {
      throw new Error('[CONFIG_INVALID] SUPPORT_REVIEW_CHANNEL_ID is not a text channel');
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${CUSTOM_IDS.RESOLVE_SUPPORT_PREFIX}${row.request_code}`)
        .setLabel('Resolve')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`${CUSTOM_IDS.CLOSE_SUPPORT_PREFIX}${row.request_code}`)
        .setLabel('Close')
        .setStyle(ButtonStyle.Secondary)
    );

    const reviewMessage = await reviewChannel.send({
      embeds: [buildSupportRequestEmbed(row)],
      components: [buttons]
    });

    await updateSupportRequestMessageMeta({
      requestCode: row.request_code,
      channelId: reviewMessage.channelId,
      messageId: reviewMessage.id
    });

    await writeAuditLog({
      guildId: interaction.guildId,
      actorId: interaction.user.id,
      actorName: interaction.user.tag,
      actionType: 'SUPPORT_REQUEST_CREATED',
      targetType: 'SUPPORT_REQUEST',
      targetId: row.request_code,
      details: {
        player_name: row.player_name,
        topic: row.topic
      }
    });

    await sendAuditLogToDiscord(interaction.client, interaction.guildId, [
      '📝 **SUPPORT_REQUEST_CREATED**',
      `Request: \`${row.request_code}\``,
      `User: <@${interaction.user.id}>`,
      `Topic: ${row.topic}`
    ]);

    await interaction.editReply({
      content: `ส่งเรื่อง support สำเร็จแล้ว ✅
เลขรายการ: **${row.request_code}**
แอดมินสามารถไปกด Resolve / Close ในห้องรีวิวได้เลย`
    });
  } catch (error) {
    await interaction.editReply({
      content: error.message?.startsWith('[TENANT_CONFIG_MISSING]')
        ? 'ยังตั้งค่าห้องไม่ครบ ใช้ `!setup-review-support` และ `!setup-log` ก่อน'
        : error.message?.startsWith('[MODULE_DISABLED]')
          ? 'โมดูล Support ยังไม่เปิดใช้งานสำหรับเซิร์ฟเวอร์นี้'
          : 'เกิดข้อผิดพลาดในระบบ กรุณาลองอีกครั้ง'
    });
    throw error;
  }
}

module.exports = { handleSupportModal };
