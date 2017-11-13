import * as express from "express";
import * as http from "http";
import { IApp } from "./IApp";
import { ChatApp } from "./chat/ChatApp";


class Startup {
    private static Self: Startup;
    private IApp: IApp;
    private ExpressApp: Express.Application;

    constructor(app: IApp) {
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

const app = new Startup(new ChatApp());
app.Start();
exports = app;