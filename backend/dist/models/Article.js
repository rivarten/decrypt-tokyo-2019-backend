"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Memcached = require("memcached");
const DB_HOST = 'localhost';
const DB_PORT = 5652;
const memcached = new Memcached(`${DB_HOST}:${DB_PORT}`);
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
            memcached.set('count', 1, 0, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(1);
            });
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