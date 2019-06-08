import * as article from '../models/Article';
import * as moment from 'moment';

export async function getListArticle(req: any, res: any): Promise<any> {
    //const count: number = await article.getCount();
    //const articles = await article.getList(count);
    //res.send({ articles });

    res.send({
        success: true,
        data: [
            {
                id: 1,
                sender: 'sender address',
                timestamp: moment().valueOf()/1000,
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
                timestamp: moment().valueOf()/1000,
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
                timestamp: moment().valueOf()/1000,
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
async function uploadArticleFile(req: any, res: any): Promise<any> {
    return {
        path: 'file path',
    };
}
export async function uploadArticle(req: any, res: any): Promise<any> {

    const sender = req.header('uniqys-sender');
    const timestamp = req.header('uniqys-timestamp');
    const blockhash = req.header('uniqys-blockhash');

    let { article } = req.body;

    //
    //ファイル受信
    //
    const file = await uploadArticleFile(req, res);
    article.path = file.path;

    //
    //ブロックチェーンに書き込み
    //
    article.put({
        sender,
        timestamp,
        blockhash,
        article
    });
}
export async function purchaseArticle(req: any, res: any): Promise<any> {
}
export async function viewArticle(req: any, res: any): Promise<any> {
}
