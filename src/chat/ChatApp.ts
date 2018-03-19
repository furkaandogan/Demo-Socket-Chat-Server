// import * as express from "express";
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

// var _self: ChatApp = undefined;

export class ChatApp implements IApp {

    Express: any;
    private static Self: ChatApp;
    private RedisConnector: Redis.RedisClient;
    public Server: http.Server;
    public SocketServer;
    public SocketSession;

    Init(): void {
        this.SocketServer.on("connection", this.Connect);
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
        console.log(`connected pid: ${process.pid} sockerId: ${socket.id}`);
        socket.on("disconnect", ChatApp.Self.Disconnect);
        socket.on("typing", ChatApp.Self.Typing);
        socket.on("send", ChatApp.Self.Send);
        socket.on("seen", ChatApp.Self.Seen);
        socket.on("set-client", ChatApp.Self.SetClient);
        socket.on("join-room", ChatApp.Self.JoinRoom);
        socket.on("disconnect-room", ChatApp.Self.DisconnectRoom);
        socket.on("add-recipient", ChatApp.Self.AddRecipient);
     }
    private SetClient(data: any): void {
        var connectionId = this.id;
        console.log("setclient="+connectionId);
        ChatApp.Self.GetRedisClient().get(data.secureKey, function (err2, secureKeyUserId) {
            if(err2){
                return;
            }
            if(data.Id != secureKeyUserId){
                return;
            }
            //Redisten uçurabilmek için çift taraflı tut... su=socket user
            console.log("setclient="+data.Id);
            ChatApp.Self.GetRedisClient().lpush("socketuser_"+data.Id.toString(), connectionId);
            ChatApp.Self.GetRedisClient().set(connectionId, data.Id.toString());
            
        });
    }
    private Disconnect(): void {
        console.log("disconnect"+this.id);
        var connectionId = this.id;
        //Redisten uçur çıkanları
        ChatApp.Self.GetRedisClient().get(connectionId, function (err2, userId) {
            ChatApp.Self.GetRedisClient().lrem("socketuser_"+userId,0,connectionId);
            ChatApp.Self.GetRedisClient().del(connectionId);       
            console.log("user disconnected pid:  ${process.pid} sockerId:  "+connectionId+"+"+userId);
        });
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
            data.ToClients.map(x=> "socketuser_" + x ).forEach(client => {
                 ChatApp.Self.GetRedisClient().lrange(client,0,-1,function (err, connections) {
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
        });
       
    }
    private Send(data: any): void {
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
            data.ToClients.map(x=> "socketuser_" + x ).forEach(client => {
                ChatApp.Self.GetRedisClient().lrange(client,0,-1,function (err, connections) {
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
        });
    }

    private Seen(data: any): void {
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
            data.ToClients.map(x=> "socketuser_" + x ).forEach(client => {
                ChatApp.Self.GetRedisClient().lrange(client,0,-1,function (err, connections) {
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
       });
    }

   private AddRecipient(data: any): void {
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
            data.ToClients.map(x=> "socketuser_" + x ).forEach(client => {
                ChatApp.Self.GetRedisClient().lrange(client,0,-1,function (err, connections) {
                    var emitData = {
                        FromClient: data.FromClient,
                        PmId: data.PmId,
                        Users: data.Users
                    };
                    connections.forEach(connectionId => {
                        if (connectionId != this.id) {
                            ChatApp.Self.SocketServer.to(connectionId).emit("add-recipient", emitData);
                        }
                    });
                }); 
            });
         });
    }
 

    // data => pm id
    private JoinRoom(data: number): void {
        var room = new Room(data);
        console.log("join room key=" + room.ToKey() + " connetion Id=" + this.id);
        this.join(room.ToKey());
        ChatApp.Self.GetRedisClient().rpush(room.ToKey(), this.id);
    }

    // data => pm id
    private DisconnectRoom(data: number): void {
        var room = new Room(data);
        console.log("disconnect room room key=" + room.ToKey() + " connetion Id=" + this.id);
        this.leave(room.ToKey());
        ChatApp.Self.GetRedisClient().lrem(room.ToKey(), 1, this.id);
    }
}