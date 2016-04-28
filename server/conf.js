// all application configurations will go here
'use strict';
const config = {}
config.APP_PORT = process.env.APP_PORT
config.RETHINK_HOST = process.env.RETHINK_HOST
config.RETHINK_NOTIFICATIONS_TBL_NAME = 'notifications'
config.INSERT_AFTER = 30000 // milliseconds
module.exports = config