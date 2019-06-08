const express = require("express");
const bodyParser = require("body-parser");

const APP_HOST = '0.0.0.0';
const APP_PORT = 5650;

const app = express();

import {
    uploadArticle,
    getListArticle,
    viewArticle,
    purchaseArticle,
} from './controllers/Article';

import {
    getUserInfo,
} from './controllers/UserInfo';

app.use(bodyParser());

app.get('/hello', async (_: any, res: any) => {
      res.send('hello');
});

app.listen(APP_PORT, APP_HOST);

app.get('/api/userinfo', getUserInfo);
app.post('/api/article/purchase', purchaseArticle);
app.get('/api/article/view', viewArticle);
app.get('/api/article/list', getListArticle);
app.post('/api/upload', uploadArticle);

