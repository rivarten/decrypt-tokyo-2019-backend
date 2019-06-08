"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article = require("../models/Article");
const App_1 = require("../config/App");
const moment = require("moment");
const fs = require("fs");
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
    const files = fs.readdirSync('./backend/dist/assets/');
    const selected_file_idx = Math.floor(Math.random() * files.length);
    return {
        path: `${App_1.AppConfig.ArticleBasePath}${files[selected_file_idx]}`,
    };
}
async function uploadArticle(req, res) {
    const sender = req.header('uniqys-sender');
    const timestamp = req.header('uniqys-timestamp');
    const blockhash = req.header('uniqys-blockhash');
    let article = {
        creator_name: 'weiwei',
        price: Math.floor(Math.random() * App_1.AppConfig.MaxPrice),
        path: '',
    };
    const file = await uploadArticleFile(req, res);
    console.log(file);
    article.path = file.path;
    Article.put({
        sender,
        timestamp,
        blockhash,
        article
    });
    res.send({
        success: true,
        data: article,
        error: null,
    });
}
exports.uploadArticle = uploadArticle;
async function purchaseArticle(req, res) {
}
exports.purchaseArticle = purchaseArticle;
async function viewArticle(req, res) {
    res.send(fs.readFileSync(`./backend/dist/assets/${req.params.file_name}`));
}
exports.viewArticle = viewArticle;
//# sourceMappingURL=Article.js.map