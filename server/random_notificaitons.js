// This module takes care of creating notifications in DB after every 30 seconds.
// provides start and stop functionality.
'use strict';
const logger = require('./logger')
const config = require('./conf')
const starwars = require('starwars');
let interval = undefined;

module.exports.start = function(r){
	interval = setInterval(function(){
		logger.info('running set interval')
		r.table(config.RETHINK_NOTIFICATIONS_TBL_NAME).insert({'message':starwars(), 'status': 'unread'}).run().then(function(err, data){
			logger.info(err, data)
		}).error(function(err){
			logger.error('unable to insert')
		});
	}, config.INSERT_AFTER);
}

module.exports.stop = function(r){
	if(typeof(interval) !== undefined){
		logger.info('stopping now --', interval)
		clearInterval(interval)
	}else{
		logger.info('First start random notifier.')
	}
}
