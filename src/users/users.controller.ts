import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

import { BaseController } from "../common/base.controller";
import { HttpError } from "../errors/http-error";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { IUsersController } from "./users.controller.interface";

@injectable()
export class UserController extends BaseController implements IUsersController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            { path: "/register", method: "post", func: this.register },
            { path: "/login", method: "post", func: this.login },
        ]);
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, "register");
    }

    login(req: Request, res: Response, next: NextFunction) {
        //this.ok<string>(res, "login");
        next(new HttpError(401, "Ошибка авторизации", "[login]"));
    }
}
