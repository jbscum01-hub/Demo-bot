const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CUSTOM_IDS } = require('../../core/customIds');
const { buildReviewedSupportEmbed } = require('../../core/embeds');
const { reviewSupportRequest } = require('../../services/support.service');
const { writeAuditLog, sendAuditLogToDiscord } = require('../../services/audit.service');
const { ensureSupportFlowReady } = require('../../services/feature-guard.service');

function disableButtons(requestCode, status) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.RESOLVE_SUPPORT_PREFIX}${requestCode}`)
      .setLabel(status === 'RESOLVED' ? 'Resolved' : 'Resolve')
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.CLOSE_SUPPORT_PREFIX}${requestCode}`)
      .setLabel(status === 'CLOSED' ? 'Closed' : 'Close')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
}

async function handleSupportReview(interaction, status, requestCode) {
  await ensureSupportFlowReady(interaction.guildId);

  const updated = await reviewSupportRequest({
    requestCode,
    status,
    reviewerId: interaction.user.id,
    reviewerName: interaction.user.tag,
    reviewNote: `${status} by ${interaction.user.tag}`
  });

  if (!updated) {
    return interaction.reply({
      content: 'รายการนี้อาจถูกจัดการไปแล้ว หรือไม่พบข้อมูล',
      flags: 64
    });
  }

  await interaction.update({
    embeds: [buildReviewedSupportEmbed(updated)],
    components: [disableButtons(requestCode, status)]
  });

  await writeAuditLog({
    guildId: interaction.guildId,
    actorId: interaction.user.id,
    actorName: interaction.user.tag,
    actionType: `SUPPORT_${status}`,
    targetType: 'SUPPORT_REQUEST',
    targetId: requestCode,
    details: {
      reviewer: interaction.user.tag,
      player_name: updated.player_name,
      topic: updated.topic
    }
  });

  await sendAuditLogToDiscord(interaction.client, interaction.guildId, [
    `${status === 'RESOLVED' ? '✅' : '🧱'} **SUPPORT_${status}**`,
    `Request: \`${requestCode}\``,
    `Reviewer: <@${interaction.user.id}>`,
    `Topic: ${updated.topic}`
  ]);
}

module.exports = { handleSupportReview };
