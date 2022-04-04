import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';

import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private UserController: UserController,
		@inject(TYPES.ExceptionFilter) private ExceptionFilter: ExceptionFilter,
	) {
		this.app = express();
		this.port = 8000;
		this.logger = logger;
		this.UserController = UserController;
		this.ExceptionFilter = ExceptionFilter;
	}

	useMiddleware(): void {
		this.app.use(express.json());
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
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен на порту ${this.port}`);
	}
}
