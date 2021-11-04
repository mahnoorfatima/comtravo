const { level } = require('log-winston-aws-level');

const   
    express = require('express'),
    bodyParser = require('body-parser'),
    cluster = require('cluster'),
    cpus = require('os').cpus().length,
    router = require("./routers/flightRouters");
    Logger = require('./util/logger');

require('dotenv').config({ path: '.env' });

const startServer = () => {
    const app = express();
    const port = 3000;
    app.use(bodyParser.json());
    process.on('uncaughtException', (err) => {
        Logger.error(`Uncaught Exception`, err)
    });

    process.on('unhandledRejection', (err) => {
        Logger.error(`Unhandled Rejection`, err)
    });
    /**
     * Starting express app
     */
    app.use("/api", router);
    app.listen(port);
};

const startSingleNode = () => {
    startServer();
};

const startInClusterMode = () => {
    if (cluster.isMaster) {
        console.log(`Master cluster setting up ${cpus} workers...`);
        for (let i = 0; i < cpus; i += 1) {
            cluster.fork();
        }
        cluster.on('online', (worker) => {
            console.log(`Worker ${worker.process.pid} is online`);
        });
        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
            console.log('Starting a new worker');
            cluster.fork();
        });
    } else {
        startSingleNode();
    }
};

startInClusterMode();