const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CUSTOM_IDS } = require('./customIds');
const { buildDemoPanelEmbed } = require('./embeds');

function buildDemoPanelPayload() {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(CUSTOM_IDS.OPEN_DONATE_MODAL)
      .setLabel('💰 Donate Flow')
      .setStyle(ButtonStyle.Primary)
  );

  return {
    embeds: [buildDemoPanelEmbed()],
    components: [row]
  };
}

module.exports = { buildDemoPanelPayload };
