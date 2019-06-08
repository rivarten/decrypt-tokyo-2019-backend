module.exports = async function() {
    await global.__TEST_MONGOD__.stop();
};
