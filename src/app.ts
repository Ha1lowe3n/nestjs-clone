import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { AuthMiddleware } from './common/auth.middleware';

import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import { IUsersController } from './users/users.controller.interface';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private UserController: UserController,
		@inject(TYPES.ExceptionFilter) private ExceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private ConfigService: IConfigService,
		@inject(TYPES.PrismaService) private PrismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
		this.logger = logger;
		this.UserController = UserController;
		this.ExceptionFilter = ExceptionFilter;
	}

	useMiddleware(): void {
		this.app.use(express.json());
		const authMiddleware = new AuthMiddleware(this.ConfigService.get('JWT_SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.UserController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.ExceptionFilter.catch.bind(this.ExceptionFilter));
	}

	/** initial app */
	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.PrismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на порту ${this.port}`);
	}
}
