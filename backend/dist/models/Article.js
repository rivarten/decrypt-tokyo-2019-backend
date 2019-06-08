"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../config/App");
const Memcached = require("memcached");
const crypto = require("crypto");
let sha256 = crypto.createHash('sha256');
const memcached = new Memcached(`${App_1.AppConfig.DB_HOST}:${App_1.AppConfig.DB_PORT}`);
async function put(data) {
    const count = await incrementArticleCount();
    sha256 = crypto.createHash('sha256');
    sha256.setEncoding('hex');
    sha256.write(data.article.path);
    sha256.end();
    return new Promise((resolve, reject) => {
        memcached.set(`article:${count}`, {
            id: count,
            sender: data.sender,
            timestamp: data.timestamp,
            blockhash: data.blockhash,
            creator_name: data.article.creator_name,
            price: data.article.price,
            path: data.article.path,
            content_hash: sha256.read(),
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
async function buy(data) {
    const count = await incrementArticleBuyCount(data.sender);
    const article = await getArticle(data.id).catch((err) => {
        return null;
    });
    return new Promise((resolve, reject) => {
        memcached.set(`article-buy:${data.sender}-${count}`, {
            id: count,
            sender: data.sender,
            timestamp: data.timestamp,
            blockhash: data.blockhash,
            article,
        }, 0, (err) => {
            if (err) {
                resolve(null);
            }
            else {
                resolve(article);
            }
        });
    });
}
exports.buy = buy;
async function getArticleCount() {
    return new Promise((resolve, reject) => {
        memcached.get('article-count', (err, result) => {
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
exports.getArticleCount = getArticleCount;
async function incrementArticleCount() {
    return new Promise((resolve, reject) => {
        memcached.incr('article-count', 1, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (typeof result === 'number') {
                return resolve(result);
            }
        });
    });
}
async function getArticleBuyCount(sender) {
    return new Promise((resolve, reject) => {
        memcached.get(`article-buy-count:${sender}`, (err, result) => {
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
exports.getArticleBuyCount = getArticleBuyCount;
async function incrementArticleBuyCount(sender) {
    return new Promise((resolve, reject) => {
        memcached.incr(`article-buy-count:${sender}`, 1, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (typeof result === 'number') {
                return resolve(result);
            }
        });
    });
}
async function getArticle(id) {
    return new Promise((resolve, reject) => {
        memcached.get(`article:${id}`, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}
async function getArticleList(count) {
    return new Promise((resolve, reject) => {
        if (!count) {
            return resolve([]);
        }
        const ids = new Array(count).fill(0).map((_, i) => i + 1);
        memcached.getMulti(ids.map(id => `article:${id}`), (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(ids.map(id => results[`article:${id}`]));
        });
    });
}
exports.getArticleList = getArticleList;
async function getArticleBuyList(sender, count) {
    return new Promise((resolve, reject) => {
        if (!count) {
            return resolve([]);
        }
        const ids = new Array(count).fill(0).map((_, i) => i + 1);
        memcached.getMulti(ids.map(id => `article-buy:${sender}-${id}`), (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(ids.map(id => results[`article-buy:${sender}-${id}`]));
        });
    });
}
exports.getArticleBuyList = getArticleBuyList;
//# sourceMappingURL=Article.js.map