const { EmbedBuilder } = require('discord.js');

function colorByStatus(status) {
  switch (status) {
    case 'APPROVED':
    case 'RESOLVED':
      return 0x57F287;
    case 'REJECTED':
    case 'CLOSED':
      return 0xED4245;
    default:
      return 0x5865F2;
  }
}

function buildDemoPanelEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🧠 Admin Workflow Demo')
    .setDescription([
      'ระบบตัวอย่างสำหรับโชว์ว่า bot ทำ workflow ได้จริง',
      '',
      'รองรับแนวคิดแบบ:',
      '• รับคำขอจากผู้เล่น',
      '• ส่งเข้าห้องรีวิวแอดมิน',
      '• กดอนุมัติ / ปฏิเสธ / ปิดเรื่อง',
      '• เก็บ log ลงฐานข้อมูล',
      '',
      'ตอนนี้เปิดให้ลอง **Donate / Whitelist / Support**'
    ].join('\n'));
}

function buildDonateRequestEmbed(row) {
  return new EmbedBuilder()
    .setColor(colorByStatus(row.status))
    .setTitle(`💰 Donate Review | ${row.request_code}`)
    .addFields(
      { name: 'สถานะ', value: row.status, inline: true },
      { name: 'ผู้ส่ง', value: `<@${row.user_id}>`, inline: true },
      { name: 'ชื่อในเกม', value: row.player_name, inline: true },
      { name: 'จำนวนเงิน', value: `${Number(row.amount).toLocaleString()} บาท`, inline: true },
      { name: 'ช่องทางชำระ', value: row.payment_method || '-', inline: true },
      { name: 'หลักฐาน', value: row.proof_url || '-', inline: false },
      { name: 'หมายเหตุ', value: row.note || '-', inline: false }
    )
    .setFooter({ text: `Discord: ${row.discord_tag || row.username}` })
    .setTimestamp(new Date(row.created_at || Date.now()));
}

function buildReviewedDonateEmbed(row) {
  const emoji = row.status === 'APPROVED' ? '✅' : '❌';
  return new EmbedBuilder()
    .setColor(colorByStatus(row.status))
    .setTitle(`${emoji} Donate ${row.status} | ${row.request_code}`)
    .addFields(
      { name: 'ผู้ส่ง', value: `<@${row.user_id}>`, inline: true },
      { name: 'ชื่อในเกม', value: row.player_name, inline: true },
      { name: 'จำนวนเงิน', value: `${Number(row.amount).toLocaleString()} บาท`, inline: true },
      { name: 'ผู้ตรวจ', value: row.reviewer_name || `<@${row.reviewer_id}>`, inline: true },
      { name: 'หมายเหตุผู้ตรวจ', value: row.review_note || '-', inline: false }
    )
    .setTimestamp(new Date(row.reviewed_at || Date.now()));
}

function buildWhitelistRequestEmbed(row) {
  return new EmbedBuilder()
    .setColor(colorByStatus(row.status))
    .setTitle(`📋 Whitelist Review | ${row.request_code}`)
    .addFields(
      { name: 'สถานะ', value: row.status, inline: true },
      { name: 'ผู้ส่ง', value: `<@${row.user_id}>`, inline: true },
      { name: 'ชื่อในเกม', value: row.player_name, inline: true },
      { name: 'อายุ', value: String(row.age), inline: true },
      { name: 'ประสบการณ์ RP / เล่นเซิร์ฟ', value: row.experience_text || '-', inline: false },
      { name: 'เหตุผลที่อยากเข้าร่วม', value: row.reason_text || '-', inline: false }
    )
    .setFooter({ text: `Discord: ${row.discord_tag || row.username}` })
    .setTimestamp(new Date(row.created_at || Date.now()));
}

function buildReviewedWhitelistEmbed(row) {
  const emoji = row.status === 'APPROVED' ? '✅' : '❌';
  return new EmbedBuilder()
    .setColor(colorByStatus(row.status))
    .setTitle(`${emoji} Whitelist ${row.status} | ${row.request_code}`)
    .addFields(
      { name: 'ผู้ส่ง', value: `<@${row.user_id}>`, inline: true },
      { name: 'ชื่อในเกม', value: row.player_name, inline: true },
      { name: 'อายุ', value: String(row.age), inline: true },
      { name: 'ผู้ตรวจ', value: row.reviewer_name || `<@${row.reviewer_id}>`, inline: true },
      { name: 'หมายเหตุผู้ตรวจ', value: row.review_note || '-', inline: false }
    )
    .setTimestamp(new Date(row.reviewed_at || Date.now()));
}

function buildSupportRequestEmbed(row) {
  return new EmbedBuilder()
    .setColor(colorByStatus(row.status))
    .setTitle(`🎫 Support Review | ${row.request_code}`)
    .addFields(
      { name: 'สถานะ', value: row.status, inline: true },
      { name: 'ผู้ส่ง', value: `<@${row.user_id}>`, inline: true },
      { name: 'ชื่อในเกม', value: row.player_name, inline: true },
      { name: 'หัวข้อ', value: row.topic, inline: false },
      { name: 'รายละเอียด', value: row.detail_text || '-', inline: false },
      { name: 'ติดต่อกลับ / หมายเหตุ', value: row.contact_text || '-', inline: false }
    )
    .setFooter({ text: `Discord: ${row.discord_tag || row.username}` })
    .setTimestamp(new Date(row.created_at || Date.now()));
}

function buildReviewedSupportEmbed(row) {
  const emoji = row.status === 'RESOLVED' ? '✅' : '🧱';
  return new EmbedBuilder()
    .setColor(colorByStatus(row.status))
    .setTitle(`${emoji} Support ${row.status} | ${row.request_code}`)
    .addFields(
      { name: 'ผู้ส่ง', value: `<@${row.user_id}>`, inline: true },
      { name: 'ชื่อในเกม', value: row.player_name, inline: true },
      { name: 'หัวข้อ', value: row.topic, inline: false },
      { name: 'ผู้ตรวจ', value: row.reviewer_name || `<@${row.reviewer_id}>`, inline: true },
      { name: 'หมายเหตุผู้ตรวจ', value: row.review_note || '-', inline: false }
    )
    .setTimestamp(new Date(row.reviewed_at || Date.now()));
}

module.exports = {
  buildDemoPanelEmbed,
  buildDonateRequestEmbed,
  buildReviewedDonateEmbed,
  buildWhitelistRequestEmbed,
  buildReviewedWhitelistEmbed,
  buildSupportRequestEmbed,
  buildReviewedSupportEmbed
};
