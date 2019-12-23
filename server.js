const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const dbUrl = "mongodb+srv://user:Tw73nGKnCSafrw4P@cluster0-bvznq.mongodb.net/test?retryWrites=true&w=majority";

const Message = mongoose.model('Message', {
  name: String,
  message: String
});


app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post('/messages', async (req, res) => {
  try {
    var message = new Message(req.body);

    let savedMessage = await message.save();

    console.log('saved');

    let censored = await Message.findOne({message: 'badword'});

    if (censored) { await Message.deleteOne({_id: censored.id}); } else { io.emit('message', req.body); }

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(err);
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

mongoose.connect(dbUrl, (err) => {
  console.log('mongo db connection', err);
});
const server = http.listen(3002, () => {
  console.log('server is listening on PORT', server.address().port);
});