import {
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Redirect,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly UserService: UsersService) {}

	@Get('activate/:link')
	@HttpCode(HttpStatus.FOUND)
	@Redirect(process.env.CLIENT_URL, HttpStatus.FOUND)
	async activateAccount(@Param('link') activation_link: string) {
		try {
			await this.UserService.activateAccount(activation_link);
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
		}
		return { message: 'Account activated successfully' };
	}
}
