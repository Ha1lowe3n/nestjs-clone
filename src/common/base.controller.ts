import { Router, Response } from "express";

import { LoggerService } from "../logger/logger.service";
import { IRoute } from "./route.interface";

export abstract class BaseController {
    private readonly _router: Router;

    constructor(private logger: LoggerService) {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    protected bindRoutes(routes: IRoute[]) {
        for (const route of routes) {
            this.logger.log(`[${route.method}] ${route.path}`);
            this.router[route.method](route.path, route.func.bind(this));
        }
    }

    public created(res: Response) {}

    public send<T>(res: Response, code: number, message: T) {
        return res.status(code).type("application/json").json(message);
    }

    public ok<T>(res: Response, message: T) {
        return this.send<T>(res, 200, message);
    }
}
