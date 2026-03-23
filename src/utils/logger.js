function log(level, message, meta) {
  const payload = meta ? ` ${JSON.stringify(meta)}` : '';
  console.log(`[${new Date().toISOString()}] [${level}] ${message}${payload}`);
}

module.exports = {
  info: (message, meta) => log('INFO', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  error: (message, meta) => log('ERROR', message, meta)
};
