const path = require('path');
const MongoMemoryServer = require('mongodb-memory-server');

const mongod = new MongoMemoryServer.default({
    instance: {
        dbName: 'jest',
    },
    binary: {
        downloadDir: path.resolve(__dirname, '../../.mongodb-binaries'),
        version: '3.6.8',
    },
    autoStart: false,
    debug: false,
});

module.exports = async () => {
    // Setup Mongo
    if (!mongod.isRunning) {
        await mongod.start();
    }
    global.__TEST_MONGOD__ = mongod;
    process.env.MONGO_URL = await mongod.getConnectionString();
    process.env.MONGO_DB_NAME = 'jest';
};
