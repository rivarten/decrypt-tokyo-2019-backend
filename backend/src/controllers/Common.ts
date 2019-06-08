export const UT_BROWSER = 1;
export const UT_APP = 2;
export async function getUserType(req: any, res: any): Promise<number> {
    const sender = req.header('uniqys-sender');
    const timestamp = req.header('uniqys-timestamp');
    const blockhash = req.header('uniqys-blockhash');
    if (!sender || !timestamp || !blockhash) {
        return UT_APP;
    }
    return UT_BROWSER;
}
