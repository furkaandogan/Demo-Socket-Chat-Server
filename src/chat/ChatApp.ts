import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import { IApp } from "../IApp";
import { Typing } from "./models/Typing";
import { Client } from "./models/Client";
import { SendingMessage } from "./models/SendingMessage";
import { Message } from "./models/Message";

// var _self: ChatApp = undefined;

export class ChatApp implements IApp {

    private static Self: ChatApp;
    public Server: http.Server;
    public SocketServer: SocketIO.Server;
    public Socket: SocketIO.Socket;

    private Users:Array<Client>;

    constructor() {

    }

    Init(): void {
        this.Users=new Array<Client>();
        this.SocketServer = socket(this.Server);
        this.SocketServer.on("connection", this.Connect);
        ChatApp.Self = this;
    }
    OnError(): void {

    }

    private Connect(socket: SocketIO.Socket): void {
        socket.on("disconnect", ChatApp.Self.Disconnect);
        socket.on("typing", ChatApp.Self.Typing);
        socket.on("send", ChatApp.Self.Send);
        ChatApp.Self.Users.push(new Client(socket.id,0));
        console.log(ChatApp.Self.Users.length)
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
}