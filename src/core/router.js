const { CUSTOM_IDS } = require('./customIds');
const {
  handleOpenDonateModal,
  handleOpenWhitelistModal,
  handleOpenSupportModal
} = require('../handlers/buttons/panel.button');
const { handleDonateModal } = require('../handlers/modals/donate.modal');
const { handleWhitelistModal } = require('../handlers/modals/whitelist.modal');
const { handleSupportModal } = require('../handlers/modals/support.modal');
const { handleDonateReview } = require('../handlers/review/donate.review');
const { handleWhitelistReview } = require('../handlers/review/whitelist.review');
const { handleSupportReview } = require('../handlers/review/support.review');

async function routeInteraction(interaction) {
  if (interaction.isButton()) {
    if (interaction.customId === CUSTOM_IDS.OPEN_DONATE_MODAL) {
      return handleOpenDonateModal(interaction);
    }

    if (interaction.customId === CUSTOM_IDS.OPEN_WHITELIST_MODAL) {
      return handleOpenWhitelistModal(interaction);
    }

    if (interaction.customId === CUSTOM_IDS.OPEN_SUPPORT_MODAL) {
      return handleOpenSupportModal(interaction);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.APPROVE_DONATE_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.APPROVE_DONATE_PREFIX.length);
      return handleDonateReview(interaction, 'APPROVED', requestCode);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.REJECT_DONATE_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.REJECT_DONATE_PREFIX.length);
      return handleDonateReview(interaction, 'REJECTED', requestCode);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.APPROVE_WHITELIST_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.APPROVE_WHITELIST_PREFIX.length);
      return handleWhitelistReview(interaction, 'APPROVED', requestCode);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.REJECT_WHITELIST_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.REJECT_WHITELIST_PREFIX.length);
      return handleWhitelistReview(interaction, 'REJECTED', requestCode);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.RESOLVE_SUPPORT_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.RESOLVE_SUPPORT_PREFIX.length);
      return handleSupportReview(interaction, 'RESOLVED', requestCode);
    }

    if (interaction.customId.startsWith(CUSTOM_IDS.CLOSE_SUPPORT_PREFIX)) {
      const requestCode = interaction.customId.slice(CUSTOM_IDS.CLOSE_SUPPORT_PREFIX.length);
      return handleSupportReview(interaction, 'CLOSED', requestCode);
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === CUSTOM_IDS.DONATE_MODAL) {
      return handleDonateModal(interaction);
    }

    if (interaction.customId === CUSTOM_IDS.WHITELIST_MODAL) {
      return handleWhitelistModal(interaction);
    }

    if (interaction.customId === CUSTOM_IDS.SUPPORT_MODAL) {
      return handleSupportModal(interaction);
    }
  }
}

module.exports = { routeInteraction };
