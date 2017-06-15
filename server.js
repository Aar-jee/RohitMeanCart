const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;
var uri = "mongodb://rohitghai91:mongodb1@conmanmongoproj-shard-00-00-tddt5.mongodb.net:27017,conmanmongoproj-shard-00-01-tddt5.mongodb.net:27017,conmanmongoproj-shard-00-02-tddt5.mongodb.net:27017/userchat?ssl=true&replicaSet=ConmanMongoProj-shard-0&authSource=admin";
//var uri= "mongodb://127.0.0.1/mittens"
mongo.connect(uri, function(err,db){
 if(err){
console.log(fatgya);
}

client.on('connection',function(socket){
  var col = db.collection('messages'),
  sendStatus= function(s){
    socket.emit('status',s);
  };
  
  //emit all messages
  col.find().limit(100).sort({_id:1}).toArray(function(err,res){
    if(err){throw err}
    socket.emit('output',res);
  });
  
  //wait for input
  socket.on('input', function(data){
    //console.log(data);
    var name = data.name,
    message = data.message;
    
    col.insert({name:name, message:message},function(){
      //console.log('inserted');
      //emit latest message
      client.emit('output',[data]);
      sendStatus({
        message: "Message Sent",
        clear:true
      });
    });
  });
});
});

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


