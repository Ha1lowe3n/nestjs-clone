import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../common/base.controller';
import { ValidateMiddleware } from '../common/validate.middleware';
import { HttpError } from '../errors/http-error';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IUsersController } from './users.controller.interface';
import { IUsersService } from './users.service.interface';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { AuthGuard } from '../common/auth.guard';

@injectable()
export class UserController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUsersService,
		@inject(TYPES.ConfigService) private ConfigService: ConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, { email: result.email, name: result.name });
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(body);
		if (!result) {
			return next(new HttpError(401, 'Ошибка авторизации', '[login]'));
		}
		const secret = this.ConfigService.get('JWT_SECRET');
		const jwt = await this.signJWT(body.email, secret);
		this.ok(res, { jwt });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { email: user });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((res, rej) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}
