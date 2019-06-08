import { AppConfig } from '../config/App';
import * as Memcached from 'memcached';

const memcached = new Memcached(`${AppConfig.DB_HOST}:${AppConfig.DB_PORT}`);

export async function put(data: any): Promise<any> {
    //
    //ブロックチェーンに書き込み
    //
    const count = await incrementCount();
    return new Promise((resolve, reject) => {
        memcached.set(`article:${count}`, {
            id: count,
            sender: data.sender,
            timestamp: data.timestamp,
            blockhash: data.blockhash,
            creator_name: data.article.creator_name,
            price: data.article.price,
            path: data.article.path,
        }, 0, (err: any) => {
            if (err) {
                resolve(-1);
            } else {
                resolve(1);
            }
        });
    });
}
export async function getCount() : Promise<number> {
    return new Promise((resolve, reject) => {
        memcached.get('count', (err: any, result: any) => {
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
async function incrementCount(): Promise<any> {
    return new Promise((resolve, reject) => {
        memcached.incr('count', 1, (err: any, result: any) => {
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
export async function getList(count: number): Promise<any> {
    return new Promise((resolve, reject) => {
        if (!count) {
            return resolve([]);
        }
        const ids = new Array(count).fill(0).map((_: any, i) => i + 1);  //[1, 2, 3, ..., count]
        memcached.getMulti(ids.map(id => `messages:${id}`), (err: any, results: any) => {
            if (err) {
                return reject(err);
            }
            resolve(ids.map(id => results[`messages:${id}`]));
        });
    });
}
