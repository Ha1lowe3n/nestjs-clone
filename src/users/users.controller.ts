import { Request, Response, NextFunction } from "express";

import { BaseController } from "../common/base.controller";
import { HttpError } from "../errors/http-error";
import { LoggerService } from "../logger/logger.service";

export class UserController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            { path: "/register", method: "post", func: this.register },
            { path: "/login", method: "post", func: this.login },
        ]);
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok<string>(res, "register");
    }

    login(req: Request, res: Response, next: NextFunction) {
        //this.ok<string>(res, "login");
        next(new HttpError(401, "Ошибка авторизации", "[login]"));
    }
}
