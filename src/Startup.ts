import * as express from "express";
import { IApp } from "./IApp";
import { ChatApp } from "./chat/ChatApp";


class Startup {

    private IApp: IApp;

    constructor(app: IApp) {
        this.IApp = app;
    }

    public Start(): void {
        this.IApp.Init();
    }
}

const app = new Startup(new ChatApp());
app.Start();
exports = app;