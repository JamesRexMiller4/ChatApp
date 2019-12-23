const request = require('request');

describe('get messages', () => {
  it('should return 200 ok', (done) => {
    request.get('http://localhost:3002/messages', (err, res) => {
      expect(res.statusCode).toEqual(200)
      done()
    })
  })

  it('should return an array with messages', (done) => {
    request.get('http://localhost:3002/messages', (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0)
      done()
    })
  })
})