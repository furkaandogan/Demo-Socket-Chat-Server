# Dh Chat Socket Server
Donanimhaber Chat Socket Server Uygulaması 


### Gereksinimler

* [Gulp](https://gulpjs.com/)
* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/en/download/) v6+ to run.

### Service

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/ead7bee222b830b97780)

Socket kanalları:
- [set-client](#set-client)
- [disconnect](#disconnect) 
- [typing](#typing) 
- [send](#typing) 
- [seen](#seen) 
- [join-room](#join-room) 
- [disconnect-room](#disconnect-room)

## Başlangıç
```js
const socket =io("http://localhost:5858");
```
## set-client
Kullanıcın bilgilerini socket connection bilgileri ile eşleştirir ve geçici olarak sockette tutulmasını sağlar

socket tarafına bildirmek için örnek:
```js
cosnt data = {
    Id: 1,
    LoginName: "furkaandogan",
    Title: "software developer",
    Avatar: "/avatar.png"
};

socket.emit("set-client",data); 
```
## typing
Kullanıcın o pm odasında mesaj yazdığını belirtmek için kullanılır.

socket tarafına bildirmek için örnek:
```js
cosnt data = {
    FromClient: {
        Id: 1,
        SecureKey: ""
    },
    PmId: 1
};

socket.emit("typing",data); 
```
socket tarafından gelen bilgileri yakalama
```js
socket.on("typing",(data)=>{
    //todo
})); 
```

## send
Kullanıcının o pm odasında mesaj attığını belirtir

socket tarafına bildirmek için örnek:
```js
cosnt data = {
    FromClient: {
        Id: 1,
        SecureKey: ""
    },
    Message:{
        Body:"pm içeriği",
        DateCreatedWellFormed:"5 sn. önce"
    },
    PmId:[ThreadId]
};

socket.emit("send",data); 
```
socket tarafından gelen bilgileri yakalama
```js
socket.on("send",(data)=>{
    //todo
})); 
```

## join-room
Kullanıcının pm odasına katıldığını bildirmek için kullanılıyor. pm odasına katılan kullanıcılar o pm üstünde geçen tüm işlemlerden haberdar edilir 
örnek olarak pmde biri mesaj yazıyor ise yazıyor bilgisi vs pushlarını

socket tarafına bildirmek için örnek:
```js
cosnt data = {
    FromClient: {
        Id: 1,
        SecureKey: ""
    }
    PmId:[ThreadId]
};

socket.emit("join-room",data); 
```

## Kurulum (Development for docker)

Geliştrime ortamı için aşağıdaki kod satırları ile hızlı bir şekilde tüm sistem ayağa kaldırılabilir.

```
$ cd Desktop/dh-chat/docker
$ docker-compose up --build
```

yada (docker olmadan local node üzerinden çalıştırma)

```
$ cd Desktop/dh-chat/src
$ npm install 
$ gulp 
$ npm start
``` 

* [localhost:5858](http://localhost:5858) adresinden socket e erişebilirsiniz.

## Kurulum (linux cloud for docker)

Canlı ortam için ise 

```
$ cd /dh-chat/cli-linux
$ make init
```

ile docker-cloud.yml de belirlenen config ile docker swarm da projeyi build alıp deploy eder

## Kullanılan Teknolojiler

* [TypeScript](https://www.javascript.com/) 
* [Gulp](https://gulpjs.com/) 
* [Nodejs](https://nodejs.org/en/) 
* [npm](https://www.npmjs.com/)
* [Promise](https://www.promisejs.org/) 
* [Redis](https://redis.io/) 
* [Docker + Swarm](https://docker.com) 
* [Nginx](https://www.nginx.com/) 
* [Makefile](https://en.wikipedia.org/wiki/Makefile)