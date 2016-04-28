// init file for our application
// it will start server and configure all needed parts of app 
"use strict";
const logger = require('./logger');
const rethinkdbdash = require('./rethink')
const app = require('http').createServer(handler)
const io = require('socket.io')(app)
const fs = require('fs')
const User = require('./user')
const config = require('./conf')
const RandomNotifications = require('./random_notificaitons');

// first event of socket.io client
io.on('connection', function(socket){
    logger.info('New connection.');
    let user = new User('Wingify', rethinkdbdash, socket);
    user.send_unread_count();
    user.send_all_notifications();
    user.register_for_change_feed()
    user.register_for_other_events()
    socket.on('disconnect', function(){
        logger.info('User disconnected');
    });
});

// we need this for serving js,css,html files
function handler(req, res) {
    logger.info('handler....', req.url)
    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'
        logger.info(req.url, 'serving CSS');
      fs.readFile(__dirname + '/public/base.css', function (err, data) {
        if (err) logger.info(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
    }else if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
        logger.info(req.url, 'serving CSS')
      fs.readFile(__dirname + '/public/client.js', function (err, data) {
        if (err) logger.info(err);
        res.writeHead(200, {'Content-Type': 'application/javascript'});
        res.write(data);
        res.end();
      });

    }else{
        fs.readFile(__dirname + '/public/index.html', function (err, data) {
            if (err) logger.info(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
          });
    }
}

// best way to protect node application
process.on('uncaughtException', function(err){
    logger.error(err);
    console.info(err)
    process.exit(1);
});

app.listen(config.APP_PORT, function(){
    logger.info('Server started on ', config.APP_PORT)
});

// This line will start pushing entries to DB
RandomNotifications.start(rethinkdbdash);

// setTimeout(function(){
//     console.info('Now no more updates ----');
//     RandomNotifications.stop();
// }, 6000000);