import { AppConfig } from '../config/App';
import * as User from '../models/User';
import { EasyClientForServer } from '@uniqys/easy-client';
//import * as Common from './Common';
import * as crypto from 'crypto';
let sha256;

const localstorage = require("localstorage-ponyfill");
const localStorage = localstorage.createLocalStorage({mode: "node"});

export async function getUserInfo(req: any, res: any): Promise<any> {
    const sender = req.header('uniqys-sender');
    res.send({
        success: true,
        data: {
            balance: User.getBalance(sender),
        },
        error: null,
    });
}
export async function beOilKing(req: any, res: any): Promise<any> {
    const sender = req.header('uniqys-sender');
    const { want_balance } = req.params;
    const current_balance = await User.beOilKing(sender, want_balance);
    res.send({
        success: true,
        data: current_balance,
        error: null,
    });
}
export async function signUp(req: any, res: any): Promise<any> {
    const { email, password } = req.query;
    console.log(email,password);
    sha256 = crypto.createHash('sha256');
    sha256.setEncoding('hex');
    sha256.write(`${email}`);
    sha256.end();
    const hash = sha256.read();
    const client = new EasyClientForServer(`http://${AppConfig.CLIENT_CONNECT_HOST}:8080`, hash);
    localStorage.setItem(client.address.toString(), hash);
    res.send({
        success: true,
        data: {
            address: client.address.toString(),
        },
        error: null,
    });
}
export async function logIn(req: any, res: any): Promise<any> {
    const { email, password } = req.body;
    console.log(email,password);
    sha256 = crypto.createHash('sha256');
    sha256.setEncoding('hex');
    sha256.write(`${email}`);
    sha256.end();
    const hash = sha256.read();
    const client = new EasyClientForServer(`http://${AppConfig.CLIENT_CONNECT_HOST}:8080`, hash);
    localStorage.setItem(client.address.toString(), hash);
    res.send({
        success: true,
        data: {
            address: client.address.toString(),
        },
        error: null,
    });
}
