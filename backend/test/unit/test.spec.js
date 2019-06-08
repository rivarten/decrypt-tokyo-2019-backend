const path = require('path');
const sinon = require('sinon');

//console.log = jest.fn();

describe('dapps()', () => {
    beforeEach(() => {
    });
    afterEach(() => {
    });
    describe('job file upload', () => {
        it('job_idが無い', async () => {
            const res = await lambda.handler(event, context, callback);
            expect(res.statusCode).toEqual(400);
            expect(JSON.parse(res.body).message).toEqual('no parameters');
        });
        it('file_nameが無い', async () => {
            const res = await lambda.handler(event, context, callback);
            expect(res.statusCode).toEqual(400);
            expect(JSON.parse(res.body).message).toEqual('no parameters');
        });
        it('無効job_id', async () => {
            event.queryStringParameters.job_id = -1;
            event.queryStringParameters.file_name = 'foo.mp4';
            awsMock.mock(
                'DynamoDB.DocumentClient',
                'get',
                (params, callback) => {
                    callback(undefined, {});
                },
            );
            const res = await lambda.handler(event, context, callback);
            expect(res.statusCode).toEqual(404);
            expect(JSON.parse(res.body).message).toEqual('Job ID not found');
        });
    });
});
