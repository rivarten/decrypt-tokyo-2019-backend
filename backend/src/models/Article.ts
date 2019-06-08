import { AppConfig } from '../config/App';
import * as Memcached from 'memcached';
import * as crypto from 'crypto';

let sha256 = crypto.createHash('sha256');

const memcached = new Memcached(`${AppConfig.DB_HOST}:${AppConfig.DB_PORT}`);

export async function put(data: any): Promise<any> {
    //
    //ブロックチェーンに書き込み: 投稿用
    //
    const count = await incrementArticleCount();
    sha256 = crypto.createHash('sha256');
    sha256.setEncoding('hex');
    //FIXME: 本当はファイルのコンテンツハッシュ
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
        }, 0, (err: any) => {
            if (err) {
                resolve(-1);
            } else {
                resolve(1);
            }
        });
    });
}
export async function buy(data: any): Promise<any> {
    //
    //ブロックチェーンに書き込み: 購入用
    //
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
        }, 0, (err: any) => {
            if (err) {
                resolve(null);
            } else {
                resolve(article);
            }
        });
    });
}
export async function getArticleCount() : Promise<number> {
    return new Promise((resolve, reject) => {
        memcached.get('article-count', (err: any, result: any) => {
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
async function incrementArticleCount(): Promise<any> {
    return new Promise((resolve, reject) => {
        memcached.incr('article-count', 1, (err: any, result: any) => {
            if (err) {
                return reject(err);
            }
            if (typeof result === 'number') {
                return resolve(result);
            }
            //memcached.set('count', 1, 0, (err: any) => {
            //    if (err) {
            //        return reject(err);
            //    }
            //    resolve(1);
            //});
        });
    });
}
export async function getArticleBuyCount(sender: string) : Promise<number> {
    return new Promise((resolve, reject) => {
        memcached.get(`article-buy-count:${sender}`, (err: any, result: any) => {
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
async function incrementArticleBuyCount(sender: string): Promise<any> {
    return new Promise((resolve, reject) => {
        memcached.incr(`article-buy-count:${sender}`, 1, (err: any, result: any) => {
            if (err) {
                return reject(err);
            }
            if (typeof result === 'number') {
                return resolve(result);
            }
            //memcached.set('count', 1, 0, (err: any) => {
            //    if (err) {
            //        return reject(err);
            //    }
            //    resolve(1);
            //});
        });
    });
}
async function getArticle(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        memcached.get(`article:${id}`, (err: any, result: any) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}
/*
async function getArticleBuy(sender: string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        memcached.get(`article-buy:${sender}-${id}`, (err: any, result: any) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}
*/
export async function getArticleList(count: number): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!count) {
            return resolve([]);
        }
        const ids = new Array(count).fill(0).map((_: any, i) => i + 1);  //[1, 2, 3, ..., count]
        memcached.getMulti(ids.map(id => `article:${id}`), (err: any, results: any) => {
            if (err) {
                return reject(err);
            }
            resolve(ids.map(id => results[`article:${id}`]));
        });
    });
}
export async function getArticleBuyList(sender: string, count: number): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!count) {
            return resolve([]);
        }
        const ids = new Array(count).fill(0).map((_: any, i) => i + 1);  //[1, 2, 3, ..., count]
        memcached.getMulti(ids.map(id => `article-buy:${sender}-${id}`), (err: any, results: any) => {
            if (err) {
                return reject(err);
            }
            resolve(ids.map(id => results[`article-buy:${sender}-${id}`]));
        });
    });
}
