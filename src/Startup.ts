// import * as express from "express";
import * as Cluster from "cluster";
import * as OS from "os";
import * as http from "http";
import { IApp } from "./IApp";
import { ChatApp } from "./chat/ChatApp";
import * as url from "url";
import * as io from 'socket.io-client';
import * as express from 'express'
import * as socket from "socket.io";

class Startup {
    private static Self: Startup;
    private IApp: IApp;
    // private ExpressApp: Express.Application;

    constructor(app: IApp) {
        this.IApp = app;
        this.IApp.Express = express()

        const router = express.Router()
        router.get('/', (req, res) => {
            res.json({
                message: 'DH Socket app'
              })
        
        });
        router.get('/test', (req, res) => {
            var socket = io("http://localhost:"+ Startup.Self.GetPort());
            var secureKey = "D375F4B6EE714A61CC9DFED5D45DF1E2";
            if(req.query.type == "seen"){
                socket.emit("seen", {
                    ToClients : [217742, 1270449, 2598459], // konuşmadaki diğer kişilerin idsi
                    FromClient : { Id : 1270449, LoginName : "cagri561" }, // gören kişi
                    PmId : 61340063,  // gördüğü pm
                    secureKey : secureKey
                });
            }else if(req.query.type == "send"){

                
                var body =  Startup.Self.makeid();
                socket.emit("send", {
                        secureKey : secureKey,
                        ToClients : [217742, 1270449, 2598459 ], // konuşmadaki diğer kişilerin idsi
                        FromClient : { Id : 1270449, LoginName : "cagri561" }, // gönderen
                        Body : body, // mesaj 
                        DateCreatedWellFormed :  "şimdi",
                        Html : body, //mesaj
                        PmId : 61340063
                    });
            }else if (req.query.type == "typing"){
                socket.emit("typing", {
                    ToClients : [217742, 1270449, 2598459], // konuşmadaki diğer kişilerin idsi
                    FromClient : { Id : 1270449, LoginName : "cagri561" },
                    PmId : 61340063, 
                    secureKey : secureKey
                });
             }
             res.json({
                ok: 'ok'
             });      
        });
                
        var  session = require("express-session")({
            secret: "my-secret",
            resave: true,
            saveUninitialized: true
          }),
          sharedsession = require("express-socket.io-session");
        
          var cookieParser = require("cookie-parser");

        this.IApp.Express.use(session);
        this.IApp.Express.use(cookieParser);

        this.IApp.Express.Server = require('http').Server(this.IApp.Express);

    
       // this.IApp.Express.Server.listen(this.GetPort());

        this.IApp.Express.use(router);
        this.IApp.Express.on("error", this.OnError);
        this.IApp.Express.on("listening", this.Listing);
        
        var redisAdapter = require('socket.io-redis');

        this.IApp.SocketServer = socket(this.IApp.Express.Server);
        var ChatAppConfig = require('./chat/ChatAppConfig');
        this.IApp.SocketServer.adapter(redisAdapter(ChatAppConfig.RedisConfig));
        this.IApp.SocketServer.use(sharedsession(session, {
            autoSave:true
        }));
        Startup.Self = this;
    }
    public makeid():String {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
       var limit = Math.random() * 10000;
        for (var i = 0; i < limit; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
      
   

    public Start(): void {
        this.IApp.Init();
    }
    private OnError(): void {
        console.log("on error");
    }

    private Listing(): void {
        console.log("listening on port " + Startup.Self.GetPort());
    }

    private GetPort(): number {
        return parseInt(process.env.port) || 5858;
    }
}
const cpus=OS.cpus().length;

require('sticky-cluster')(
    function (callback) {
        var chatApp = new ChatApp();
        const app = new Startup(chatApp);
        app.Start();
        callback(chatApp.Express.Server);
        exports = app;
    },{
      concurrency: cpus,
      port: parseInt(process.env.port) || 5858,
      debug: true,
      env: function (index) { return { stickycluster_worker_index: index }; }
    }

);


/*
if(Cluster.isMaster){
    for (let i = 0; i < cpus; i++) {
        Cluster.fork();
    }
    
    Cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}else{
  
    console.log(`Worker ${process.pid} started`);
}
*/