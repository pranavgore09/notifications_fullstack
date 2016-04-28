# Notification Fullstack App

Simple applicaiton that generates a notification every 30 seconds and it is pushed to browser client realtime.
Client can receive, read, delete notifications.

> Please install docker, docker-machine, docker-compose. 
> With this you can setup this fullstack application in just one command.

### Version
1.0.0

### Tech

Notifications_fullstack uses following projects:

* [RethinkDB] - Must have for realtime apps
* [node.js] - evented I/O for the backend
* [jQuery] - super


### Installation

Make sure you have docker, docker-compose, docker-machine installed properly. Then go inside the downloaded/cloned directory and execute following command.

```sh
$ docker-compose up -d
```
###Check application
```sh
$ docker-machine ip
```
Above command should print IP ADDR e.g>1.1.1.1
Now, Go to the browser and hit ***http://IP_ADDR:9999**
> Other notes are mentioned on the above webpage itself.

###Check logs
```sh
tail -f -n 20 server/logs/error.log
```

###Stop containers
```sh
$ docker stop $(docker ps -aq) // this will stop all running containers
```

License
----

MIT

