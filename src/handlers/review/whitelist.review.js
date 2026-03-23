const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CUSTOM_IDS } = require('../../core/customIds');
const { buildReviewedWhitelistEmbed } = require('../../core/embeds');
const { reviewWhitelistRequest } = require('../../services/whitelist.service');
const { writeAuditLog, sendAuditLogToDiscord } = require('../../services/audit.service');
const { ensureWhitelistFlowReady } = require('../../services/feature-guard.service');

function disableButtons(requestCode) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.APPROVE_WHITELIST_PREFIX}${requestCode}`)
      .setLabel('Approved')
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.REJECT_WHITELIST_PREFIX}${requestCode}`)
      .setLabel('Rejected')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );
}

async function handleWhitelistReview(interaction, status, requestCode) {
  await ensureWhitelistFlowReady(interaction.guildId);

  const updated = await reviewWhitelistRequest({
    requestCode,
    status,
    reviewerId: interaction.user.id,
    reviewerName: interaction.user.tag,
    reviewNote: `${status} by ${interaction.user.tag}`
  });

  if (!updated) {
    return interaction.reply({
      content: 'รายการนี้อาจถูกตรวจไปแล้ว หรือไม่พบข้อมูล',
      ephemeral: true
    });
  }

  await interaction.update({
    embeds: [buildReviewedWhitelistEmbed(updated)],
    components: [disableButtons(requestCode)]
  });

  await writeAuditLog({
    guildId: interaction.guildId,
    actorId: interaction.user.id,
    actorName: interaction.user.tag,
    actionType: `WHITELIST_${status}`,
    targetType: 'WHITELIST_REQUEST',
    targetId: requestCode,
    details: {
      reviewer: interaction.user.tag,
      player_name: updated.player_name,
      age: updated.age
    }
  });

  await sendAuditLogToDiscord(interaction.client, interaction.guildId, [
    `${status === 'APPROVED' ? '✅' : '❌'} **WHITELIST_${status}**`,
    `Request: \`${requestCode}\``,
    `Reviewer: <@${interaction.user.id}>`,
    `Player: ${updated.player_name}`
  ]);
}

module.exports = { handleWhitelistReview };
