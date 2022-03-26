import express, { Express } from "express";
import { Server } from "http";

export class App {
    app: Express;
    port: number;
    server: Server;

    constructor() {
        this.app = express();
        this.port = 8000;
    }

    useRoutes() {
        // this.app.use("/users");
    }

    // запускаем наше приложение
    public async init() {
        this.useRoutes();
        this.server = this.app.listen(this.port);
        console.log("Сервер запущен");
    }
}
