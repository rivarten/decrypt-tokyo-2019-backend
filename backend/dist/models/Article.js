"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../config/App");
const Memcached = require("memcached");
const memcached = new Memcached(`${App_1.AppConfig.DB_HOST}:${App_1.AppConfig.DB_PORT}`);
async function put(data) {
    const count = await incrementCount();
    return new Promise((resolve, reject) => {
        memcached.set(`article:${count}`, {
            id: count,
            sender: data.sender,
            timestamp: data.timestamp,
            blockhash: data.blockhash,
            creator_name: data.article.creator_name,
            price: data.article.price,
            path: data.article.path,
        }, 0, (err) => {
            if (err) {
                resolve(-1);
            }
            else {
                resolve(1);
            }
        });
    });
}
exports.put = put;
async function getCount() {
    return new Promise((resolve, reject) => {
        memcached.get('count', (err, result) => {
            if (err) {
                return reject(err);
            }
            if (typeof result === 'number') {
                return resolve(result);
            }
            resolve(0);
        });
    });
}
exports.getCount = getCount;
async function incrementCount() {
    return new Promise((resolve, reject) => {
        memcached.incr('count', 1, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (typeof result === 'number') {
                return resolve(result);
            }
        });
    });
}
async function getList(count) {
    return new Promise((resolve, reject) => {
        if (!count) {
            return resolve([]);
        }
        const ids = new Array(count).fill(0).map((_, i) => i + 1);
        memcached.getMulti(ids.map(id => `messages:${id}`), (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(ids.map(id => results[`messages:${id}`]));
        });
    });
}
exports.getList = getList;
//# sourceMappingURL=Article.js.map