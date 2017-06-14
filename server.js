var mongo = require('mongodb').MongoClient;
var client = require('socket.io').listen(8080).sockets;

// client.configure(function () { 
//       client.set("transports", ["xhr-polling"]); 
//       client.set("polling duration", 10); 
//     });

mongo.connect('mongodb://127.0.0.1/chat', function(err,db){
  console.log("we are connected");
  if(err){
     console.log(fatgya);
    throw err;
   
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
    var name = data.name,
    message = data.message;
    
    col.insert({name:name, message:message},function(){
      //emit latest message
      cleint.emit('output',[data]);
      sendStatus({
        message: "Message Sent",
        clear:true
      });
    });
  });
});
});

