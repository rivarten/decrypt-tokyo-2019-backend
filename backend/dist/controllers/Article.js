"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Article = require("../models/Article");
const App_1 = require("../config/App");
const fs = require("fs");
const moment = require("moment");
const Common = require("./Common");
const easy_client_1 = require("@uniqys/easy-client");
const crypto = require("crypto");
let sha256;
const localstorage = require("localstorage-ponyfill");
const localStorage = localstorage.createLocalStorage({ mode: "node" });
async function getListArticle(req, res) {
    const count = await Article.getArticleCount();
    let articles = await Article.getArticleList(count);
    for (let i = 0; i < articles.length; i++) {
        delete articles[i].path;
    }
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
    let sender = '';
    let timestamp = 0;
    let blockhash = '';
    const user_type = await Common.getUserType(req, res);
    switch (user_type) {
        case Common.UT_BROWSER:
            sender = req.header('uniqys-sender');
            timestamp = req.header('uniqys-timestamp');
            blockhash = req.header('uniqys-blockhash');
            break;
        case Common.UT_APP:
            const seed = localStorage.getItem(req.body.address);
            console.log(`seed: ${seed}`);
            sha256 = crypto.createHash('sha256');
            sha256.setEncoding('hex');
            sha256.write(`${seed}`);
            sha256.end();
            const hash = sha256.read();
            const client = new easy_client_1.EasyClientForServer(`http://${App_1.AppConfig.CLIENT_CONNECT_HOST}:8080`, hash);
            await client.post('/api/upload', {}, { sign: true });
            break;
    }
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
    const sender = req.header('uniqys-sender');
    const timestamp = req.header('uniqys-timestamp');
    const blockhash = req.header('uniqys-blockhash');
    const { id } = req.params;
    const article = await Article.buy({
        sender,
        timestamp,
        blockhash,
        id
    }).catch((err) => {
        return res.send({
            success: false,
            data: article,
            error: `何かエラー: ${JSON.stringify(err)}`,
        });
    });
    res.send({
        success: true,
        data: article,
        error: null,
    });
}
exports.purchaseArticle = purchaseArticle;
async function viewArticle(req, res) {
    res.send(fs.readFileSync(`./backend/dist/assets/${req.params.file_name}`));
}
exports.viewArticle = viewArticle;
//# sourceMappingURL=Article.js.map