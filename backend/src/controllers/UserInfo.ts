import * as userInfo from '../models/UserInfo';

export async function getUserInfo(req: any, res: any): Promise<any> {
    res.send({
        success: true,
        data: {
            balance: userInfo.getBalance(),
        },
        error: null,
    });
}
