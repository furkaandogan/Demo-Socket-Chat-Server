import * as http from "http";
import * as socket from "socket.io";
import * as SocketRedis from "socket.io-redis";
import { promisify } from "util";
import * as Promise from "bluebird";
import * as Redis from "redis";
import ChatAppConfig from "./ChatAppConfig";
import { IApp } from "../IApp";
import { Client } from "./models/Client";
// import { Typing } from "./models/Typing";
// import { SendingMessage } from "./models/SendingMessage";
// import { Message } from "./models/Message";
import { Room } from "./models/Room";
import { json } from "body-parser";

Promise.promisifyAll(Redis.RedisClient.prototype);
Promise.promisifyAll(Redis.Multi.prototype);

export class ChatApp implements IApp {

    private static Self: ChatApp;
    private RedisConnector: Redis.RedisClient;
    public Server: http.Server;
    public SocketServer: SocketIO.Server;

    constructor() {

    }

    Init(): void {
        this.SocketServer = socket(this.Server);
        this.SocketServer.adapter(new SocketRedis(ChatAppConfig.RedisConfig));
        this.SocketServer.on("connection", this.Connect.bind(this));
        ChatApp.Self = this;
    }
    
    OnError(): void {

    }

    private GetRedisClient(): Redis.RedisClient {
        if(this.RedisConnector==null){
            this.RedisConnector = Redis.createClient(ChatAppConfig.RedisConfig);
        }
        return this.RedisConnector;
    }
    private Connect(socket: SocketIO.Socket): void {
        socket.on("disconnect", this.Disconnect);
        socket.on("typing", this.Typing);
        socket.on("send", this.Send);
        socket.on("seen", this.Seen);
        socket.on("set-client", this.SetClient);
        socket.on("join-room", this.JoinRoom);
        socket.on("disconnect-room", ChatApp.Self.DisconnectRoom);
    }
    private Disconnect(): void {
        console.log("user disconnected");
    }
    private Typing(data: any): void {
        /*var room = new Room(data.Room.PmId);
        console.log("room key=" + room.ToKey() + "member Id=" + data.FromClient.Id + " connetion Id=" + this.id);
        ChatApp.Self.SocketServer.to(room.ToKey()).emit("typing", {
            Member: new Client(this.id, data.FromClient.Id, data.FromClient.LoginName),
            Room: {
                Key: room.ToKey(),
                Id: data.Room.PmId
            }
        });*/

        ChatApp.Self.GetRedisClient().mget(data.ToClients, function (err, connections) {
            if(data.secureKey == undefined){
                return;
            }
            ChatApp.Self.GetRedisClient().get(data.secureKey, function (err2, secureKeyUserId) {
                if(err2){
                    return;
                }
                if(data.FromClient.Id != secureKeyUserId){
                    return;
                }
            
                var emitData = {
                    Member: data.Member,
                    FromClient : data.FromClient,
                    PmId:data.PmId
                };
                connections.forEach(connectionId => {
                    if (connectionId != this.id) {
                        ChatApp.Self.SocketServer.to(connectionId).emit("typing", emitData);
                    }
                }); 
            });
        });
    }
    private Send(data: any): void {

       
         ChatApp.Self.GetRedisClient().mget(data.ToClients, function (err, connections) {
            if(data.secureKey == undefined){
                return;
            }
            ChatApp.Self.GetRedisClient().get(data.secureKey, function (err2, secureKeyUserId) {
                if(err2){
                    return;
                }
                if(data.FromClient.Id != secureKeyUserId){
                    return;
                }

                var emitData = {
                    Member: data.Member,
                    Body: data.Body,
                    DateCreatedWellFormed: data.DateCreatedWellFormed,
                    Html: data.Html,
                    FromClient : data.FromClient,
                    PmId:data.PmId
                };
                connections.forEach(connectionId => {
                    if (connectionId != this.id) {
                        ChatApp.Self.SocketServer.to(connectionId).emit("send", emitData);
                    }
                });
            });
        });
    }

    private Seen(data: any): void {
        ChatApp.Self.GetRedisClient().mget(data.ToClients, function (err, connections) {
           if(data.secureKey == undefined){
               return;
           }
           ChatApp.Self.GetRedisClient().get(data.secureKey, function (err2, secureKeyUserId) {
               if(err2){
                   return;
               }
               if(data.FromClient.Id != secureKeyUserId){
                   return;
               }
               var emitData = {
                   FromClient : data.FromClient,
                   PmId:data.PmId
               };
               connections.forEach(connectionId => {
                   if (connectionId != this.id) {
                       ChatApp.Self.SocketServer.to(connectionId).emit("seen", emitData);
                   }
               });
           });
       });
   }

    private SetClient(data: any): void {
        var connectionId = this.id;
        ChatApp.Self.GetRedisClient().get(data.secureKey, function (err2, secureKeyUserId) {
            if(err2){
                return;
            }
            if(data.Id != secureKeyUserId){
                return;
            }
            ChatApp.Self.GetRedisClient().set(data.Id.toString(), connectionId);
        });
    }

    // data => pm id
    private JoinRoom(data: number): void {
        var room = new Room(data);
        this.join(room.ToKey());
        ChatApp.Self.GetRedisClient().rpush(room.ToKey(), this.id);
    }

    // data => pm id
    private DisconnectRoom(data: number): void {
        var room = new Room(data);
        this.leave(room.ToKey());
        ChatApp.Self.GetRedisClient().lrem(room.ToKey(), 1, this.id);
    }
}