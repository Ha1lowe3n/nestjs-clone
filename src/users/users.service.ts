import { inject, injectable } from 'inversify';
import { compare } from 'bcrypt';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { IUsersService } from './users.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUsersService {
	constructor(
		@inject(TYPES.ConfigService) private ConfigService: IConfigService,
		@inject(TYPES.UsersRepository) private UsersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.ConfigService.get('SALT');
		await newUser.setPassword(password, salt);
		const existedUser = await this.UsersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return await this.UsersRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.UsersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const user = new User(existedUser.email, existedUser.name, existedUser.password);
		const checkPassword = await user.comparePassword(password);
		if (!checkPassword) {
			return false;
		}
		return true;
	}
}
