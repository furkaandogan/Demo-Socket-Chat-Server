"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket = require("socket.io");
const Redis = require("redis");
const ChatAppConfig_1 = require("./ChatAppConfig");
// import { Typing } from "./models/Typing";
const Client_1 = require("./models/Client");
// import { SendingMessage } from "./models/SendingMessage";
// import { Message } from "./models/Message";
const Room_1 = require("./models/Room");
// var _self: ChatApp = undefined;
class ChatApp {
    constructor() {
    }
    Init() {
        this.SocketServer = socket(this.Server);
        this.SocketServer.on("connection", this.Connect);
        ChatApp.Self = this;
    }
    OnError() {
    }
    GetRedisClient() {
        if (this.RedisConnector == null) {
            this.RedisConnector = Redis.createClient(ChatAppConfig_1.default.RedisConfig);
        }
        return this.RedisConnector;
    }
    Connect(socket) {
        socket.on("disconnect", ChatApp.Self.Disconnect);
        socket.on("typing", ChatApp.Self.Typing);
        socket.on("send", ChatApp.Self.Send);
        socket.on("set-client", ChatApp.Self.SetClient);
        socket.on("join-room", ChatApp.Self.JoinRoom);
        socket.on("disconnect-room", ChatApp.Self.DisconnectRoom);
    }
    Disconnect() {
        console.log("user disconnected");
    }
    Typing(data) {
        var room = new Room_1.Room(data.Room.PmId);
        console.log("room key=" + room.ToKey() + "member Id=" + data.FromClient.Id + " connetion Id=" + this.id);
        ChatApp.Self.SocketServer.to(room.ToKey()).emit("typing", {
            Member: new Client_1.Client(this.id, data.FromClient.Id, data.FromClient.LoginName),
            Room: {
                Key: room.ToKey(),
                Id: data.Room.PmId
            }
        });
    }
    Send(data) {
        console.log(data);
        ChatApp.Self.RedisConnector.mget(data.ToClients, function (err, connections) {
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
    SetClient(data) {
        console.log("member Id=" + data.Id + " connetion Id=" + this.id);
        ChatApp.Self.RedisConnector.set(data.Id.toString(), this.id);
    }
    // data => pm id
    JoinRoom(data) {
        var room = new Room_1.Room(data);
        console.log("join room key=" + room.ToKey() + " connetion Id=" + this.id);
        this.join(room.ToKey());
        ChatApp.Self.RedisConnector.rpush(room.ToKey(), this.id);
    }
    // data => pm id
    DisconnectRoom(data) {
        var room = new Room_1.Room(data);
        console.log("disconnect room room key=" + room.ToKey() + " connetion Id=" + this.id);
        this.leave(room.ToKey());
        ChatApp.Self.RedisConnector.lrem(room.ToKey(), 1, this.id);
    }
}
exports.ChatApp = ChatApp;
