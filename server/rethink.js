// this will setup rethink we required database=test and table=notifications
'use strict';
const logger = require('winston');
const config = require('./conf');
const rethinkdbdash = require('rethinkdbdash')({'host':config.RETHINK_HOST});

// tries to create a table, if already exist, clear the table
rethinkdbdash.tableCreate('notifications').run().then(function(result){
    rethinkdbdash.table('notifications').delete().run().error(function(err){
        logger.error(err)
    })
}).error(function(err){
    logger.error(err)
    rethinkdbdash.table('notifications').delete().run().error(function(err){
        logger.error(err)
    });
});
module.exports = rethinkdbdash
