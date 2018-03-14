import * as http from "http";

export interface IApp {

    Server: http.Server;
    Init(): void;
    OnError(): void;
}