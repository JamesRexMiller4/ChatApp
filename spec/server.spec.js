/* eslint-disable no-undef */
const request = require('request');

describe('get messages', () => {
  it('should return 200 ok', (done) => {
    request.get('http://localhost:3002/messages', (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });

  it('should return an array with messages', (done) => {
    request.get('http://localhost:3002/messages', (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });

  describe('get messages from specific user', () => {
    it('should return 200 ok', (done) => {
      request.get('http://localhost:3002/messages/Tim', (err, res) => {
        expect(res.statusCode).toEqual(200);
        done();
      });
    });

    it('name should be tim', (done) => {
      request.get('http://localhost:3002/messages/Tim', (err, res) => {
        expect(JSON.parse(res.body)[0].name).toEqual('Tim');
        done();
      });
    });
  });
});
