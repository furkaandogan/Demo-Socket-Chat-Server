"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket = require("socket.io");
const Client_1 = require("./models/Client");
// var _self: ChatApp = undefined;
class ChatApp {
    constructor() {
    }
    Init() {
        this.Users = new Array();
        this.SocketServer = socket(this.Server);
        this.SocketServer.on("connection", this.Connect);
        ChatApp.Self = this;
    }
    OnError() {
    }
    Connect(socket) {
        socket.on("disconnect", ChatApp.Self.Disconnect);
        socket.on("typing", ChatApp.Self.Typing);
        socket.on("send", ChatApp.Self.Send);
        ChatApp.Self.Users.push(new Client_1.Client(socket.id, 0));
        console.log(ChatApp.Self.Users.length);
    }
    Disconnect() {
        console.log("user disconnected");
    }
    Typing(data) {
        console.log(data);
        ChatApp.Self.SocketServer.emit("typing", data);
        ChatApp.Self.SocketServer.to(data.ToClient.ConnectionId);
    }
    Send(data) {
        console.log(data);
    }
}
exports.ChatApp = ChatApp;
