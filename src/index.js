const express = require('express');
const bodyParser = require('body-parser');
const cluster = require('cluster');
const cpus = require('os').cpus().length;
const router = require('./routers/flightRouters');
const Logger = require('./util/logger');

require('dotenv').config({ path: '.env' });

const startServer = () => {
  const app = express();
  const port = 3000;
  app.use(bodyParser.json());
  process.on('uncaughtException', (err) => {
    Logger.error('Uncaught Exception', err);
  });

  process.on('unhandledRejection', (err) => {
    Logger.error('Unhandled Rejection', err);
  });
  /**
     * Starting express app
     */
  app.use('/api', router);
  app.listen(port);
};

const startSingleNode = () => {
  startServer();
};

const startInClusterMode = () => {
  if (cluster.isMaster) {
    Logger.info(`Master cluster setting up ${cpus} workers...`);
    for (let i = 0; i < cpus; i += 1) {
      cluster.fork();
    }
    cluster.on('online', (worker) => {
      Logger.info(`Worker ${worker.process.pid} is online`);
    });
    cluster.on('exit', (worker, code, signal) => {
      Logger.info(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
      Logger.info('Starting a new worker');
      cluster.fork();
    });
  } else {
    startSingleNode();
  }
};

startInClusterMode();
