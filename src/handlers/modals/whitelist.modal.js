const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { CUSTOM_IDS } = require('../../core/customIds');
const { buildWhitelistRequestEmbed } = require('../../core/embeds');
const { createWhitelistRequest, updateWhitelistRequestMessageMeta } = require('../../services/whitelist.service');
const { writeAuditLog, sendAuditLogToDiscord } = require('../../services/audit.service');
const { ensureWhitelistFlowReady } = require('../../services/feature-guard.service');

async function handleWhitelistModal(interaction) {
  const ageRaw = interaction.fields.getTextInputValue('age').trim();
  const age = Number(ageRaw);

  if (!Number.isInteger(age) || age < 10 || age > 99) {
    return interaction.reply({
      content: 'อายุไม่ถูกต้อง กรุณากรอกเป็นตัวเลข 10-99',
      flags: 64
    });
  }

  await interaction.deferReply({ flags: 64 });

  try {
    const config = await ensureWhitelistFlowReady(interaction.guildId);

    const row = await createWhitelistRequest({
      guildId: interaction.guildId,
      userId: interaction.user.id,
      username: interaction.user.username,
      discordTag: interaction.user.tag,
      playerName: interaction.fields.getTextInputValue('player_name').trim(),
      age,
      experienceText: interaction.fields.getTextInputValue('experience_text').trim(),
      reasonText: interaction.fields.getTextInputValue('reason_text').trim()
    });

    const reviewChannel = await interaction.client.channels.fetch(config.WHITELIST_REVIEW_CHANNEL_ID);
    if (!reviewChannel || !reviewChannel.isTextBased()) {
      throw new Error('[CONFIG_INVALID] WHITELIST_REVIEW_CHANNEL_ID is not a text channel');
    }

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`${CUSTOM_IDS.APPROVE_WHITELIST_PREFIX}${row.request_code}`)
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`${CUSTOM_IDS.REJECT_WHITELIST_PREFIX}${row.request_code}`)
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger)
    );

    const reviewMessage = await reviewChannel.send({
      embeds: [buildWhitelistRequestEmbed(row)],
      components: [buttons]
    });

    await updateWhitelistRequestMessageMeta({
      requestCode: row.request_code,
      channelId: reviewMessage.channelId,
      messageId: reviewMessage.id
    });

    await writeAuditLog({
      guildId: interaction.guildId,
      actorId: interaction.user.id,
      actorName: interaction.user.tag,
      actionType: 'WHITELIST_REQUEST_CREATED',
      targetType: 'WHITELIST_REQUEST',
      targetId: row.request_code,
      details: {
        player_name: row.player_name,
        age: row.age
      }
    });

    await sendAuditLogToDiscord(interaction.client, interaction.guildId, [
      '📝 **WHITELIST_REQUEST_CREATED**',
      `Request: \`${row.request_code}\``,
      `User: <@${interaction.user.id}>`,
      `Player: ${row.player_name}`
    ]);

    await interaction.editReply({
      content: `ส่งใบสมัครสำเร็จแล้ว ✅\nเลขรายการ: **${row.request_code}**\nแอดมินสามารถไปกด Approve / Reject ในห้องรีวิวได้เลย`
    });
  } catch (error) {
    await interaction.editReply({
      content: error.message?.startsWith('[TENANT_CONFIG_MISSING]')
        ? 'ยังตั้งค่าห้องไม่ครบ ใช้ `!setup-review-whitelist` และ `!setup-log` ก่อน'
        : error.message?.startsWith('[MODULE_DISABLED]')
          ? 'โมดูล Whitelist ยังไม่เปิดใช้งานสำหรับเซิร์ฟเวอร์นี้'
          : 'เกิดข้อผิดพลาดในระบบ กรุณาลองอีกครั้ง'
    });
    throw error;
  }
}

module.exports = { handleWhitelistModal };
