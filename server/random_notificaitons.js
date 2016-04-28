// This module takes care of creating notifications in DB after every 30 seconds.
// provides start and stop functionality.
'use strict';
const config = require('./conf')
const starwars = require('starwars');
let interval = undefined;

module.exports.start = function(r){
	interval = setInterval(function(){
		console.log('i am set interval')
		r.table(config.RETHINK_NOTIFICATIONS_TBL_NAME).insert({'message':starwars(), 'status': 'unread'}).run().then(function(err, data){
			console.log(err, data)
		}).error(function(err){
			console.error('unable to insert')
		});
	}, config.INSERT_AFTER);
}

module.exports.stop = function(r){
	if(typeof(interval) !== undefined){
		console.log('stopping now --', interval)
		clearInterval(interval)
	}else{
		console.log('First start random notifier.')
	}
}
