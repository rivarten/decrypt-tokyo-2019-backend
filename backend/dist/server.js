"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const App_1 = require("./config/App");
const app = express();
const Article_1 = require("./controllers/Article");
const User_1 = require("./controllers/User");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.get('/hello', async (_, res) => {
    res.send('hello');
});
app.listen(App_1.AppConfig.APP_PORT, App_1.AppConfig.APP_HOST);
app.get('/api/userinfo', User_1.getUserInfo);
app.post('/api/article/purchase/:id', Article_1.purchaseArticle);
app.get('/assets/article/:file_name', Article_1.viewArticle);
app.get('/api/article/list', Article_1.getListArticle);
app.post('/api/upload', Article_1.uploadArticle);
app.post('/api/be-oil-king/:want_balance', User_1.beOilKing);
app.get('/api/signup', User_1.signUp);
app.post('/api/login', User_1.logIn);
//# sourceMappingURL=server.js.map