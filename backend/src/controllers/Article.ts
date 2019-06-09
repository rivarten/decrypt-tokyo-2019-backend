import * as Article from '../models/Article';
import { AppConfig } from '../config/App';
import * as fs from 'fs';

//import * as moment from 'moment';
//import * as Common from './Common';
//import { EasyClientForServer } from '@uniqys/easy-client';
//import * as crypto from 'crypto';
//let sha256;

//const localstorage = require("localstorage-ponyfill");
//const localStorage = localstorage.createLocalStorage({mode: "node"});

export async function getListArticle(req: any, res: any): Promise<any> {
    const count: number = await Article.getArticleCount();
    console.log(count);
    let articles = await Article.getArticleList(count);
    console.log(articles);
    for (let i=0; i < articles.length; i++) {
        delete articles[i].path;
    }
    //FIXME:
    //      add response
    //          purchase_total_count:
    //          value:
    res.send({
        success: true,
        data: articles,
        error: null,
    });

    //res.send({
    //    success: true,
    //    data: [
    //        {
    //            id: 1,
    //            sender: 'sender address',
    //            timestamp: moment().valueOf()/1000,
    //            blockhash: 'block hash',
    //            creator_name: 'creator name',
    //            price: 300,
    //            purchase_count: 100,
    //            value: 5.0,
    //            path: 'http://192.168.100.125:8080/assets/article/path.jpg',
    //        },
    //        {
    //            id: 2,
    //            sender: 'sender address',
    //            timestamp: moment().valueOf()/1000,
    //            blockhash: 'block hash',
    //            creator_name: 'creator name 2',
    //            price: 300,
    //            purchase_count: 100,
    //            value: 5.0,
    //            path: 'http://192.168.100.125:8080/assets/article/path2.jpg',
    //        },
    //        {
    //            id: 3,
    //            sender: 'sender address',
    //            timestamp: moment().valueOf()/1000,
    //            blockhash: 'block hash',
    //            creator_name: 'creator name 2',
    //            price: 300,
    //            purchase_count: 100,
    //            value: 5.0,
    //            path: 'http://192.168.100.125:8080/assets/article/path2.jpg',
    //        },
    //    ],
    //    error: null,
    //});
}
async function uploadArticleFile(req: any, res: any): Promise<any> {
    //FIXME: this is for hackathon temp implement
    const files = fs.readdirSync('./backend/dist/assets/');
    const selected_file_idx = Math.floor(Math.random() * files.length);
    return {
        path: `${AppConfig.ArticleBasePath}${files[selected_file_idx]}`,
    };
}
export async function uploadArticle(req: any, res: any): Promise<any> {

    let sender = req.header('uniqys-sender');
    if (!sender) {
        return res.sendStatus(400);
    }
    let timestamp = req.header('uniqys-timestamp');
    let blockhash = req.header('uniqys-blockhash');

    //FIXME: this is for hackathon temp implement
    //const { article } = req.body;
    let article = {
        creator_name: 'weiwei',
        price: Math.floor(Math.random() * AppConfig.MaxPrice),
        path: '',
    };

    //パラメータチェック
    //FIXME: this is for hackathon temp implement
    //if (typeof article.creator_name !== 'string' ||
    //    typeof article.price !== 'number') {
    //    res.send({
    //        success: false,
    //        data: null,
    //        error: 'パラメータ異常',
    //    });
    //    return;
    //}

    
    //
    //ファイル受信
    //
    const file = await uploadArticleFile(req, res);
    console.log(file);
    article.path = file.path;

    
    //ブロックチェーンに書き込み
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
export async function purchaseArticle(req: any, res: any): Promise<any> {
    const sender = req.header('uniqys-sender');
    const timestamp = req.header('uniqys-timestamp');
    const blockhash = req.header('uniqys-blockhash');
    const { id } = req.params;
    const article: any = await Article.buy({
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
export async function viewArticle(req: any, res: any): Promise<any> {
    res.send(fs.readFileSync(`./backend/dist/assets/${req.params.file_name}`));
}
