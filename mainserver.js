var mongo = require('mongodb').MongoClient;
assert = require ('assert');
var redisClient = require('redis').createClient;
var redis = redisClient(8081, 'localhost'); 
var express=require('express');
var http = require('http');
var app = express();

var morgan=require('morgan');
var path = require('path');

var bodyParser=require('body-Parser');

var hostname ='localhost';

var port = 8080;

app.use(morgan('dev'));
    
var routes = require('./routes/index');
var users = require('./routes/users');
    
app.use(bodyParser.json());

app.use('/', routes);
app.use('/users', users);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

 app.use(require('stylus').middleware(path.join(__dirname, 'public')));  
   app.use(express.static(__dirname + '/public'));

var serve = http.createServer(app);
var io = require('socket.io')(serve);

serve.listen(port, function() {
    console.log('Express server listening on port ' + port);
});



var url ='mongodb://localhost:27017/chats';


    
    io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
        });
    socket.on('chat', function (msg) {
        socket.broadcast.emit('chat', msg);
    
   

    mongo.connect(url,function(err,db){
    assert.equal(err,null);
    
     var collection = db.collection('chatmessages');
    collection.insert({ msg }, function(err,o){
        if (err) { console.warn(err.message); }
        else { console.log("chat message inserted into db: " + msg); }
    });
           
    
    });
    
    mongo.connect(url,function(err,db){
    assert.equal(err,null);
    redis.flushall();
         redis.get("cool",function(err,reply){
            if (err) throw err;
            else if (reply)
                JSON.parse(reply);
            else{
    var collection = db.collection('chatmessages')
    var stream = collection.find().sort().limit(10).stream();
stream.on('data', function (chat) { socket.emit('chat', chat.content); });
redis.set("cool",JSON.stringify(msg),function(){
        
        });
            };
         });            
});

    
    
    });
    });
 