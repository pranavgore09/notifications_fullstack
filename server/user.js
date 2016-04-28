// this module performs all user specific activities.
// attach event handlers and emit events for accepted connection
'use strict';
const logger = require('./logger');
const config = require('./conf')
const notifications_table_name = config.RETHINK_NOTIFICATIONS_TBL_NAME

// User class defines set of utilities to be used for double ended socket communication
let User = function(name, rethinkdbdash, socket){
    logger.info('Creating new user')
    const r = rethinkdbdash
    let new_user = {}
    new_user.name = name
    new_user.socket = socket

    // select count() where status=unread
    // emit the result with event_name=count
    new_user.send_unread_count = function(){
        r.table(notifications_table_name).filter({'status': 'unread'}).count().run().then(function(count){
            new_user.socket.emit('count', count);
        }).error(function(err){
            logger.error('Could not get count..', err)
        })
    }

    new_user.send_all_notifications = function(){
        r.table(notifications_table_name).run().then(function(data){
            new_user.socket.emit('notifications', data)
        }).catch(function(err){
            logger.error('Could not get count..', err)
        })
    }

    // this is heart of rethinkdb
    // this attaches a cursor to the given query. Whenever change happens to the queryresult, cursor will be invoked
    //emit the result with event_name=notifications
    new_user.register_for_change_feed = function(){
        r.table(notifications_table_name).changes({'includeTypes': true}).run().then(function(cursor){
            new_user.feed_cursor = cursor
            cursor.each(function(err, data){
                if (data['type'] == 'add' && data['new_val']){
                    new_user.socket.emit('notifications', [data['new_val']]);
                    new_user.send_unread_count();
                }
            }, function(err, done){
                logger.info(err, done);
            });
        }).error(function(err){
            logger.error('Unable to get change feed. ', err);
        })
    }

    // this method registers a user for actions like delete, mark_read, disconnect
    new_user.register_for_other_events = function(){
        new_user.socket.on('delete', function(recordId) {
            logger.info('Removing id = ', recordId)
            r.table(notifications_table_name).get(recordId).delete().run().then(function(data){
                logger.info('Deletion result. ', data);
            }).error(function(err){
                logger.error('Error. ', err)
            })
        });

        new_user.socket.on('mark_read', function(recordId){
            logger.info('Updating id = ', recordId);
            r.table(notifications_table_name).get(recordId).update({'status': 'read'}).run().then(function(data){
                    logger.info('Updatiion result. ', data)
                new_user.send_unread_count();
            }).error(function(err){
              logger.error('Error. ', err)  
            });
        });

        new_user.socket.on('disconnect', function(){
            if(new_user.feed_cursor)
                new_user.feed_cursor.close();
        });
    }

    // if someone forgets to use 'new' while creating User then
    // this will save their lives.
    return new_user;
}

module.exports = User