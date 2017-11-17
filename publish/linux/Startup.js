"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const ChatApp_1 = require("./chat/ChatApp");
class Startup {
    constructor(app) {
        this.IApp = app;
        this.IApp.Server = http.createServer(function (req, res) {
            res.write("dh chat app");
            res.end();
        });
        this.IApp.Server.listen(this.GetPort());
        this.IApp.Server.on("error", this.OnError);
        this.IApp.Server.on("listening", this.Listing);
        Startup.Self = this;
    }
    Start() {
        this.IApp.Init();
    }
    OnError() {
        console.log("on error");
    }
    Listing() {
        console.log("listening on port " + Startup.Self.GetPort());
    }
    GetPort() {
        return parseInt(process.env.port) || 5858;
    }
}
const app = new Startup(new ChatApp_1.ChatApp());
app.Start();
exports = app;
