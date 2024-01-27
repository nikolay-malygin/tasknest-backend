import { UserDto } from '../../users/dto/user.dto';

export interface SignInResponse {
	message: string;
	data?: {
		access_token: string;
		user: UserDto;
	};
}
