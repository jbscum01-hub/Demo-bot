const { query } = require('../db/query');
const { buildRequestCode } = require('../utils/requestCode');

async function createDonateRequest(payload) {
  const requestCode = buildRequestCode('DON');

  const result = await query(
    `INSERT INTO demo_donate_requests (
      request_code, guild_id, user_id, username, discord_tag, player_name,
      amount, payment_method, proof_url, note, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'PENDING')
    RETURNING *`,
    [
      requestCode,
      payload.guildId,
      payload.userId,
      payload.username,
      payload.discordTag,
      payload.playerName,
      payload.amount,
      payload.paymentMethod,
      payload.proofUrl,
      payload.note || null
    ]
  );

  return result.rows[0];
}

async function getDonateRequestByCode(requestCode) {
  const result = await query(
    `SELECT * FROM demo_donate_requests WHERE request_code = $1 LIMIT 1`,
    [requestCode]
  );
  return result.rows[0] || null;
}

async function updateDonateRequestMessageMeta({ requestCode, channelId, messageId }) {
  await query(
    `UPDATE demo_donate_requests
     SET channel_id = $2, message_id = $3
     WHERE request_code = $1`,
    [requestCode, channelId, messageId]
  );
}

async function reviewDonateRequest({ requestCode, status, reviewerId, reviewerName, reviewNote }) {
  const result = await query(
    `UPDATE demo_donate_requests
     SET status = $2,
         reviewer_id = $3,
         reviewer_name = $4,
         review_note = $5,
         reviewed_at = NOW()
     WHERE request_code = $1
       AND status = 'PENDING'
     RETURNING *`,
    [requestCode, status, reviewerId, reviewerName, reviewNote || null]
  );

  return result.rows[0] || null;
}

module.exports = {
  createDonateRequest,
  getDonateRequestByCode,
  updateDonateRequestMessageMeta,
  reviewDonateRequest
};
