const { CUSTOM_IDS } = require('./customIds');
const { handleOpenDonateModal } = require('../handlers/buttons/panel.button');
const { handleDonateModal } = require('../handlers/modals/donate.modal');
const { handleDonateReview } = require('../handlers/review/donate.review');

async function routeInteraction(interaction) {
  if (interaction.isButton()) {
    if (interaction.customId === CUSTOM_IDS.OPEN_DONATE_MODAL) {
      return handleOpenDonateModal(interaction);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.APPROVE_DONATE_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.APPROVE_DONATE_PREFIX.length);
      return handleDonateReview(interaction, 'APPROVED', requestCode);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.REJECT_DONATE_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.REJECT_DONATE_PREFIX.length);
      return handleDonateReview(interaction, 'REJECTED', requestCode);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === CUSTOM_IDS.DONATE_MODAL) {
      return handleDonateModal(interaction);
    }
  }
}

module.exports = { routeInteraction };
