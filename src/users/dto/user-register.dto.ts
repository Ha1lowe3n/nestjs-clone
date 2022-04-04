import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неверно указан email' })
	email: string;

	@IsNotEmpty({ message: 'Не указан пароль' })
	@MinLength(5, {
		message: 'Password is too short, min length 5',
	})
	@MaxLength(15, {
		message: 'Password is too long, max length 15',
	})
	password: string;

	@IsNotEmpty({ message: 'Не указано имя' })
	name: string;
}
