import * as http from "http";

export interface IApp {

    Server: Express.Application;
    Init(): void;
    OnError(): void;
}