const logger = require('../src/utils/logger');
const { runDbInit, runHealthcheck } = require('../src/bootstrap/bootstrap.service');

(async () => {
  try {
    logger.info('Bootstrapping application');
    await runDbInit();
    await runHealthcheck();
    logger.info('Bootstrap completed. Starting bot...');
    require('../src/index');
  } catch (error) {
    logger.error('Bootstrap failed', { error: error.message });
    process.exit(1);
  }
})();
