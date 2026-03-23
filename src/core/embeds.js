const { EmbedBuilder } = require('discord.js');

function buildDemoPanelEmbed() {
  return new EmbedBuilder()
    .setTitle('🧠 Admin Workflow Demo')
    .setDescription([
      'ระบบตัวอย่างสำหรับโชว์ว่า bot ทำ workflow ได้จริง',
      '',
      'รองรับแนวคิดแบบ:',
      '• รับคำขอจากผู้เล่น',
      '• ส่งเข้าห้องรีวิวแอดมิน',
      '• กดอนุมัติ / ปฏิเสธ',
      '• เก็บ log ลงฐานข้อมูล',
      '',
      'ตอนนี้เปิดให้ลอง **Donate Flow** ก่อน'
    ].join('\n'));
}

function buildDonateRequestEmbed(row) {
  return new EmbedBuilder()
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

module.exports = {
  buildDemoPanelEmbed,
  buildDonateRequestEmbed,
  buildReviewedDonateEmbed
};
