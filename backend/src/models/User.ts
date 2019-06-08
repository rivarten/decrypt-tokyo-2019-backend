import { AppConfig } from '../config/App';
//import * as Memcached from 'memcached';
import axios from 'axios';

//const memcached = new Memcached(`${AppConfig.DB_HOST}:${AppConfig.DB_PORT}`);

export async function getBalance(address: string): Promise<number> {
    const uri = `http://${AppConfig.INNER_API_HOST}:${AppConfig.INNER_API_PORT}/accounts/${address}/balance`
    const response = await axios.get(uri)
    const balance = response.data[0]
    return balance;
}
export async function beOilKing(address: string, balance: number): Promise<any> {
    const uri = `http://${AppConfig.INNER_API_HOST}:${AppConfig.INNER_API_PORT}/accounts/${address}/balance`;
    await axios.put(uri, JSON.stringify([balance]), { headers: { 'Content-Type': 'application/json' } })
    const current_balance = getBalance(address);
    return current_balance;
}
