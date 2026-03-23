const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CUSTOM_IDS } = require('../../core/customIds');
const { buildReviewedDonateEmbed } = require('../../core/embeds');
const { reviewDonateRequest } = require('../../services/donate.service');
const { writeAuditLog, sendAuditLogToDiscord } = require('../../services/audit.service');
const { ensureDonateFlowReady } = require('../../services/feature-guard.service');

function disableButtons(requestCode) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.APPROVE_DONATE_PREFIX}${requestCode}`)
      .setLabel('Approved')
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId(`${CUSTOM_IDS.REJECT_DONATE_PREFIX}${requestCode}`)
      .setLabel('Rejected')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true)
  );
}

async function handleDonateReview(interaction, status, requestCode) {
  await ensureDonateFlowReady(interaction.guildId);

  const updated = await reviewDonateRequest({
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
    embeds: [buildReviewedDonateEmbed(updated)],
    components: [disableButtons(requestCode)]
  });

  await writeAuditLog({
    guildId: interaction.guildId,
    actorId: interaction.user.id,
    actorName: interaction.user.tag,
    actionType: `DONATE_${status}`,
    targetType: 'DONATE_REQUEST',
    targetId: requestCode,
    details: {
      reviewer: interaction.user.tag,
      amount: updated.amount,
      player_name: updated.player_name
    }
  });

  await sendAuditLogToDiscord(interaction.client, interaction.guildId, [
    `${status === 'APPROVED' ? '✅' : '❌'} **DONATE_${status}**`,
    `Request: \`${requestCode}\``,
    `Reviewer: <@${interaction.user.id}>`,
    `Player: ${updated.player_name}`
  ]);
}

module.exports = { handleDonateReview };
