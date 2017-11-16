import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import * as Redis from "redis";
import ChatAppConfig from "./ChatAppConfig";
import { IApp } from "../IApp";
// import { Typing } from "./models/Typing";
import { Client } from "./models/Client";
// import { SendingMessage } from "./models/SendingMessage";
// import { Message } from "./models/Message";
import { Room } from "./models/Room";
import { json } from "body-parser";

// var _self: ChatApp = undefined;

export class ChatApp implements IApp {

    private static Self: ChatApp;
    private RedisConnector: Redis.RedisClient;
    public Server: http.Server;
    public SocketServer: SocketIO.Server;

    constructor() {

    }

    Init(): void {
        this.SocketServer = socket(this.Server);
        this.SocketServer.on("connection", this.Connect);
        this.RedisConnector = Redis.createClient(ChatAppConfig.RedisConfig);
        ChatApp.Self = this;
    }
    OnError(): void {

    }

    private Connect(socket: SocketIO.Socket): void {
        socket.on("disconnect", ChatApp.Self.Disconnect);
        socket.on("typing", ChatApp.Self.Typing);
        socket.on("send", ChatApp.Self.Send);
        socket.on("set-client", ChatApp.Self.SetClient);
        socket.on("join-room", ChatApp.Self.JoinRoom);
        socket.on("disconnect-room", ChatApp.Self.DisconnectRoom);
        socket.emit("set-client", socket.id);
    }
    private Disconnect(): void {
        console.log("user disconnected");
    }
    private Typing(data: any): void {
        var room = new Room(data.Room.PmId);
        console.log("room key=" + room.ToKey() + "member Id=" + data.FromClient.Id + " connetion Id=" + this.id);
        ChatApp.Self.SocketServer.to(room.ToKey()).emit("typing", {
            Member: new Client(this.id, data.FromClient.Id, data.FromClient.LoginName),
            RoomKey: room.ToKey()
        });
    }
    private Send(data: any): void {
        console.log(data);
        ChatApp.Self.RedisConnector.mget(data.ToClients, function (err,connections) {
            console.log(err);
            console.log(connections);
            var emitData = {
                Member: data.Member,
                Body: data.Body,
                DateCreatedWellFormed: data.DateCreatedWellFormed,
                Html: data.Html
            };
            connections.forEach(connectionId => {
                if (connectionId != this.id) {
                    ChatApp.Self.SocketServer.to(connectionId).emit("send", emitData);
                }
            });
        });
    }

    private SetClient(data: any): void {
        console.log("member Id=" + data.Id + " connetion Id=" + this.id);
        ChatApp.Self.RedisConnector.set(data.Id.toString(), this.id);
    }

    // data => pm id
    private JoinRoom(data: number): void {
        var room = new Room(data);
        console.log("join room key=" + room.ToKey() + " connetion Id=" + this.id);
        this.join(room.ToKey());
        ChatApp.Self.RedisConnector.rpush(room.ToKey(), this.id);
    }

    // data => pm id
    private DisconnectRoom(data: number): void {
        var room = new Room(data);
        console.log("disconnect room room key=" + room.ToKey() + " connetion Id=" + this.id);
        this.leave(room.ToKey());
        ChatApp.Self.RedisConnector.lrem(room.ToKey(), 1, this.id);
    }
}