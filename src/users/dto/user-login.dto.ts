import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsNotEmpty({ message: 'Не указан пароль' })
	password: string;
}
