import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import ChatAppConfig from "./ChatAppConfig";
import { IApp } from "../IApp";
import { Typing } from "./models/Typing";
import { Client } from "./models/Client";
import { SendingMessage } from "./models/SendingMessage";
import { Message } from "./models/Message";
import * as Redis from "redis";

// var _self: ChatApp = undefined;

export class ChatApp implements IApp {

    private static Self: ChatApp;
    private RedisConnector: Redis.RedisClient;
    public Server: http.Server;
    public SocketServer: SocketIO.Server;
    public Socket: SocketIO.Socket;
    private Users: Array<Client>;

    constructor() {

    }

    Init(): void {
        this.Users = new Array<Client>();
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
        socket.broadcast.to(socket.id).emit("set-connection-id", { ConnectionId: socket.id });
    }
    private Disconnect(): void {
        console.log("user disconnected");
    }
    private Typing(data: Typing): void {
        console.log(data);
        ChatApp.Self.SocketServer.emit("typing", data);
        ChatApp.Self.SocketServer.to(data.ToClient.ConnectionId);
    }
    private Send(data: SendingMessage): void {
        console.log(data);

    }
    private SetClient(data: any): void {
        ChatApp.Self.RedisConnector.set(data.MemberId, this.id);
        ChatApp.Self.Users.push(new Client(data.ConnectionId, data.MemberId));
        console.log("SetClient" + this.id)
    }
}