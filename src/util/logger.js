const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const LOGGER_CONSTANTS = require('../constants/logger');

const service = 'comtravoAPI';
const consoleLogger = () => new winston.transports.Console({
  name: 'console',
  level: process.env.LOG_LEVEL || LOGGER_CONSTANTS.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`),
  ),
  handleExceptions: true,
});

const addCloudWatchLogger = (service) => {
  winston.loggers.add(service, {
    level:  process.env.LOG_LEVEL || LOGGER_CONSTANTS.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
    ),
    transports: [
      consoleLogger(),
      new WinstonCloudWatch({
        name: 'cloud',
        level: process.env.LOG_LEVEL || LOGGER_CONSTANTS.LOG_LEVEL,
        messageFormatter: info => `[${info.timestamp}] ${info.level.toUpperCase()} ${info.message}`,
        logGroupName: LOGGER_CONSTANTS.LOG_GROUP_NAME,
        logStreamName: `${LOGGER_CONSTANTS.LOG_STREAM_NAME}-${new Date().getTime()}`,
        awsRegion: LOGGER_CONSTANTS.AWS_REGION,
        handleExceptions: true,
      }),
    ],
  });
};

const addFailureCloudWatchLogger = (service) => {
  winston.loggers.add(`${service}-fail`, {
    level: process.env.LOG_LEVEL || LOGGER_CONSTANTS.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
    ),
    transports: [
      consoleLogger(),
      new WinstonCloudWatch({
        name: 'cloud',
        level: process.env.LOG_LEVEL || LOGGER_CONSTANTS.LOG_LEVEL,
        messageFormatter: info => `[${info.timestamp}] ${info.level.toUpperCase()} ${info.message}`,
        logGroupName: LOGGER_CONSTANTS.LOG_GROUP_NAME,
        logStreamName: `${LOGGER_CONSTANTS.LOG_STREAM_NAME}-${new Date().getTime()}`,
        awsRegion: LOGGER_CONSTANTS.AWS_REGION,
        handleExceptions: true,
      }),
    ],
  });
};

/**
* Add different loggers to winston
*/
const init = () => {
  winston.loggers.add('default', {
    level: process.env.LOG_LEVEL || LOGGER_CONSTANTS.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
    ),
    transports: [
      consoleLogger(),
    ],
  });
  
  addCloudWatchLogger(service);
  addFailureCloudWatchLogger(service);
};

class Logger {
  static getLogger(name) {
    const logName = name || 'default';
    return winston.loggers.get(logName);
  }

  static flush() {
    winston.loggers.loggers.forEach((logVal) => {
      const log = logVal;
      const transport = log.transports.find(t => t.name === 'cloud');
      if (transport) {
        transport.kthxbye(() => { });
      }
    });
  }

  static updateLevel(level, name) {
    winston.loggers.loggers.forEach((logVal, logKey) => {
      const log = logVal;
      if (!name || logKey === name) {
        log.level = level;
        log.transports.forEach((transportVal) => {
          const transport = transportVal;
          transport.level = level;
        });
      }
    });
  }

  static currentLevel(name) {
    return Logger.getLogger(name).level;
  }

  static debug(message, name) {
    const log = Logger.getLogger(name);
    log.debug(message);
  }

  static info(message, name) {
    const log = Logger.getLogger(name);
    log.info(message);
  }

  static warn(message, name) {
    const log = Logger.getLogger(name);
    log.warn(message);
  }

  static error(message, name) {
    const log = Logger.getLogger(name);
    log.error(message);
  }
}

init();

module.exports = Logger;
