"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const APP_HOST = '0.0.0.0';
const APP_PORT = 5650;
const app = express();
const Article_1 = require("./controllers/Article");
const UserInfo_1 = require("./controllers/UserInfo");
app.use(bodyParser());
app.get('/hello', async (_, res) => {
    res.send('hello');
});
app.listen(APP_PORT, APP_HOST);
app.get('/api/userinfo', UserInfo_1.getUserInfo);
app.post('/api/article/purchase', Article_1.purchaseArticle);
app.get('/api/article/view', Article_1.viewArticle);
app.get('/api/article/list', Article_1.getListArticle);
app.post('/api/upload', Article_1.uploadArticle);
//# sourceMappingURL=server.js.map