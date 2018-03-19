import * as http from "http";

export interface IApp {

    Express;   
    SocketServer;
    SocketSession;
    Init(): void;
    OnError(): void;
}