const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const { CUSTOM_IDS } = require('../../core/customIds');

async function handleOpenDonateModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(CUSTOM_IDS.DONATE_MODAL)
    .setTitle('ส่งคำขอโดเนท (Demo)');

  const playerName = new TextInputBuilder()
    .setCustomId('player_name')
    .setLabel('ชื่อตัวละคร / ชื่อในเกม')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const amount = new TextInputBuilder()
    .setCustomId('amount')
    .setLabel('จำนวนเงิน')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('เช่น 300')
    .setRequired(true)
    .setMaxLength(20);

  const paymentMethod = new TextInputBuilder()
    .setCustomId('payment_method')
    .setLabel('ช่องทางชำระเงิน')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('PromptPay / Bank / TrueMoney')
    .setRequired(true)
    .setMaxLength(50);

  const proofUrl = new TextInputBuilder()
    .setCustomId('proof_url')
    .setLabel('ลิงก์หลักฐาน / รูปสลิป')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('https://...')
    .setRequired(true)
    .setMaxLength(500);

  const note = new TextInputBuilder()
    .setCustomId('note')
    .setLabel('หมายเหตุเพิ่มเติม')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder().addComponents(playerName),
    new ActionRowBuilder().addComponents(amount),
    new ActionRowBuilder().addComponents(paymentMethod),
    new ActionRowBuilder().addComponents(proofUrl),
    new ActionRowBuilder().addComponents(note)
  );

  await interaction.showModal(modal);
}

module.exports = { handleOpenDonateModal };
