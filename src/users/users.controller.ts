import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from './dto/register-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { IUsersController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = new User(body.email, body.name);
		await newUser.setPassword(body.password);
		this.ok(res, newUser);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HttpError(401, 'Ошибка авторизации', '[login]'));
	}
}
