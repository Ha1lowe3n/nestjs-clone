import { UserRegisterDto } from './dto/register-login.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';

export interface IUsersService {
	createUser(dto: UserRegisterDto): Promise<User | null>;
	validateUser(dto: UserLoginDto): Promise<boolean>;
}
