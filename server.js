const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = "mongodb+srv://user:Tw73nGKnCSafrw4P@cluster0-bvznq.mongodb.net/test?retryWrites=true&w=majority"

const Message = mongoose.model('Message', {
  name: String,
  message: String
});


app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
});

app.post('/messages', (req, res) => {
  var message = new Message(req.body)

  message.save().then(() => {
    console.log('saved')
    return Message.findOne({message: 'badword'})
  })
    .then(censored => {
      if (censored) {
        console.log('censored words found', censored)
        return Message.deleteOne({_id: censored.id})
      }
      io.emit('message', req.body)
      res.sendStatus(200)
    })
    .catch((err) => {
      res.sendStatus(500)
      return console.error(err)
    });
});

// Message.findOne({message: 'badword'}, (err, censored) => {
//   if (censored) {
//     console.log('censored words found', censored)
//     Message.remove({_id: censored.id}, (err) => {
//       console.log('removed censored message')
//     });
//   }
// });
// io.emit('message', req.body);
// res.sendStatus(200);
io.on('connection', (socket) => {
  console.log('a user connected');
});

mongoose.connect(dbUrl, (err) => {
  console.log('mongo db connection', err)
})
const server = http.listen(3002, () => {
  console.log('server is listening on PORT', server.address().port);
});