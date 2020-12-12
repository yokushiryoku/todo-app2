const assert = require('assert');
const app = require('../app');
const debug = require('debug')('todo-app:server');
const http = require('http');

const PORT = 13000;

// テストするたびにTODOに一つタスクが追加されるので、あまり良くないテストです。
describe('エンドツーエンドのテスト', function () {

  let server;
  before(function () {
    app.set('port', PORT);
    server = app.listen(app.get('port'), function () {
      debug('Express server listening on port ' + server.address().port)
    });
  });

  after(function () {
    server.close();
  });

  describe('app', function () {
    it('テスト用のエンドポイントが正常に返ってくる', function (done) {
      http.get({
        hostname: 'localhost',
        port: PORT,
        path: '/api/v1',
        agent: false
      }, (res) => {
        const {statusCode} = res;
        assert(statusCode, 200);

        let rawData = "";
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData, parsedData.message);
            assert.equal(parsedData.message, "Hello,world")
          } catch (e) {
            console.error(e.message);
          }
          done();
        });
      });
    });

    it('一覧取得できる', function (done) {
      http.get({
        hostname: 'localhost',
        port: PORT,
        path: '/api/index',
        agent: false
      }, (res) => {
        const {statusCode} = res;
        assert(statusCode, 200);

        let rawData = "";
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            // console.log(JSON.stringify(parsedData, null, 4));
            assert.equal(parsedData.title, "ToDo")
          } catch (e) {
            console.error(e.message);
          }
          done();
        });
      });
    });

    it('追加できる', function (done) {
      const postData = JSON.stringify({
        title: 'test title',
        memo: 'test memo',
        finished: '2020-01-01 00:00:00',
      });
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/api/add',
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        assert.equal(res.statusCode, 201);
        done();
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      req.write(postData);
      req.end();
    });
  });
});

