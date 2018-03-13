import * as Cluster from "cluster";
import * as OS from "os";
import * as http from "http";
import { IApp } from "./IApp";
import { ChatApp } from "./chat/ChatApp";
import * as url from "url";
import * as io from 'socket.io-client';

class Startup {
    private static Self: Startup;
    private IApp: IApp;

    constructor(app: IApp) {
        this.IApp = app;
        this.IApp.Server = http.createServer(function (req, res) {
            var parsedUrl = url.parse(req.url, true); // true to get query as object
            var queryAsObject = parsedUrl.query;
          
         
            if(parsedUrl.pathname == "/test"){
                var socket = io("http://localhost:"+ Startup.Self.GetPort());
                var secureKey = "D375F4B6EE714A61CC9DFED5D45DF1E2";
                if(parsedUrl.query.type == "seen"){
                    socket.emit("seen", {
                        ToClients : [217742, 1270449, 2598459],
                        FromClient : { Id : 1270449, LoginName : "cagri561" },
                        PmId : 61340063, 
                        secureKey : secureKey
                    });
                }else if(parsedUrl.query.type == "send"){

                  
                    var body =  Startup.Self.makeid();
                    socket.emit("send", {
                            secureKey : secureKey,
                            ToClients : [217742, 1270449, 2598459 ],
                            FromClient : { Id : 1270449, LoginName : "cagri561" },
                            Body : body,
                            DateCreatedWellFormed :  "şimdi",
                            Html : body,
                            PmId : 61340063
                        });
                }else if (parsedUrl.query.type == "typing"){
                    socket.emit("typing", {
                        ToClients : [217742, 1270449, 2598459],
                        FromClient : { Id : 1270449, LoginName : "cagri561" },
                        PmId : 61340063, 
                        secureKey : secureKey
                    });
                }
             
            }      


            res.write("dh chat app"+req.url);
            res.end();
        });
        this.IApp.Server.listen(this.GetPort());
        this.IApp.Server.on("error", this.OnError);
        this.IApp.Server.on("listening", this.Listing);
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
if(Cluster.isMaster){
    for (let i = 0; i < cpus; i++) {
        Cluster.fork();
    }
    
    Cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}else{
    const app = new Startup(new ChatApp());
    app.Start();
    exports = app;
    console.log(`Worker ${process.pid} started`);
}