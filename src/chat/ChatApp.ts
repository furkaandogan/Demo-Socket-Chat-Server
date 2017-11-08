import * as express from "express";
import * as http from "http";
import * as socket from "socket.io";
import { IApp } from "../IApp";
import { Typing } from "./models/Typing";
import { Client } from "./models/Client";

export class ChatApp implements IApp {

    Server: http.Server;//express.Application;
    Socket: SocketIO.Server;
    // Port: number;

    constructor() {
        this.Init();
    }

    Init(): void {
        // var app = express();
        // app.get("/", function (req, res) {
        //     res.write("chat app");
        //     res.end();
        // });
        this.Server = http.createServer();
        this.Socket = socket(this.Server);
        this.Server.listen(this.GetPort());
        this.Server.on("error", this.OnError);
        this.Server.on("listening", this.Listing);
        this.Socket.on("connection", this.Connect);
    }
    OnError(): void {

    }

    private GetPort(): number {
        return parseInt(process.env.port) || 5858;
    }
    private Connect(socket: SocketIO.Socket): void {
        console.log("user connected");
        socket.on("disconnect", this.Disconnect);
        socket.on("typing", function (data: Typing) {
            socket.emit("typing",data);
        });
    }
    private Disconnect() {
        console.log("user disconnected");
    }
    private Typing(data: Typing) {
        console.log(data);
    }

    private Listing(): void {
        console.log("listening on port");
    }

}