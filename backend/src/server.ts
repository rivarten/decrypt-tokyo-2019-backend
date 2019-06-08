const express = require("express");
const bodyParser = require("body-parser");

import { AppConfig } from './config/App';

const app = express();

import {
    uploadArticle,
    getListArticle,
    viewArticle,
    purchaseArticle,
} from './controllers/Article';

import {
    getUserInfo,
    beOilKing,
    signUp,
    logIn,
} from './controllers/User';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/hello', async (_: any, res: any) => {
      res.send('hello');
});

app.listen(AppConfig.APP_PORT, AppConfig.APP_HOST);

app.get('/api/userinfo', getUserInfo);
app.post('/api/article/purchase/:id', purchaseArticle);
app.get('/assets/article/:file_name', viewArticle);
app.get('/api/article/list', getListArticle);
app.post('/api/upload', uploadArticle);
app.post('/api/be-oil-king/:want_balance', beOilKing);


//
//for NativeApp
//

//signup
//
//  response
//      address
app.get('/api/signup', signUp);
app.post('/api/login', logIn);
