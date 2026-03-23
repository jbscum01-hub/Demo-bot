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

async function handleOpenWhitelistModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(CUSTOM_IDS.WHITELIST_MODAL)
    .setTitle('ส่งใบสมัคร Whitelist (Demo)');

  const playerName = new TextInputBuilder()
    .setCustomId('player_name')
    .setLabel('ชื่อตัวละคร / ชื่อในเกม')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(100);

  const age = new TextInputBuilder()
    .setCustomId('age')
    .setLabel('อายุ')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('เช่น 21')
    .setRequired(true)
    .setMaxLength(3);

  const experience = new TextInputBuilder()
    .setCustomId('experience_text')
    .setLabel('ประสบการณ์ RP / เล่นเซิร์ฟ')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  const reason = new TextInputBuilder()
    .setCustomId('reason_text')
    .setLabel('เหตุผลที่อยากเข้าร่วม')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder().addComponents(playerName),
    new ActionRowBuilder().addComponents(age),
    new ActionRowBuilder().addComponents(experience),
    new ActionRowBuilder().addComponents(reason)
  );

  await interaction.showModal(modal);
}

module.exports = { handleOpenDonateModal, handleOpenWhitelistModal };
