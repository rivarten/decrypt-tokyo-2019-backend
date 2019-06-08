"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
async function getListArticle(req, res) {
    res.send({
        success: true,
        data: [
            {
                id: 1,
                sender: 'sender address',
                timestamp: moment().valueOf() / 1000,
                blockhash: 'block hash',
                creator_name: 'creator name',
                price: 300,
                purchase_count: 100,
                value: 5.0,
                path: 'http://192.168.100.125:8080/assets/article/path.jpg',
            },
            {
                id: 2,
                sender: 'sender address',
                timestamp: moment().valueOf() / 1000,
                blockhash: 'block hash',
                creator_name: 'creator name 2',
                price: 300,
                purchase_count: 100,
                value: 5.0,
                path: 'http://192.168.100.125:8080/assets/article/path2.jpg',
            },
            {
                id: 3,
                sender: 'sender address',
                timestamp: moment().valueOf() / 1000,
                blockhash: 'block hash',
                creator_name: 'creator name 2',
                price: 300,
                purchase_count: 100,
                value: 5.0,
                path: 'http://192.168.100.125:8080/assets/article/path2.jpg',
            },
        ],
        error: null,
    });
}
exports.getListArticle = getListArticle;
async function uploadArticleFile(req, res) {
    return {
        path: 'file path',
    };
}
async function uploadArticle(req, res) {
    const sender = req.header('uniqys-sender');
    const timestamp = req.header('uniqys-timestamp');
    const blockhash = req.header('uniqys-blockhash');
    let { article } = req.body;
    const file = await uploadArticleFile(req, res);
    article.path = file.path;
    article.put({
        sender,
        timestamp,
        blockhash,
        article
    });
}
exports.uploadArticle = uploadArticle;
async function purchaseArticle(req, res) {
}
exports.purchaseArticle = purchaseArticle;
async function viewArticle(req, res) {
}
exports.viewArticle = viewArticle;
//# sourceMappingURL=Article.js.map