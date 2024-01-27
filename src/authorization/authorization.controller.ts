import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { AuthorizationService } from './authorization.service';
import { AuthenticatedRequest } from './dto/auth-request.dto';
import { AuthorizationResponse } from './dto/auth-response.dto';
import { SignInResponse } from './dto/sign-in-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('authorization')
export class AuthorizationController {
	constructor(
		private readonly EmailService: EmailService,
		private readonly AuthorizationService: AuthorizationService
	) {}

	@Post('sign-up')
	@HttpCode(HttpStatus.OK)
	async signUp(@Body() body: SignUpDto): Promise<AuthorizationResponse> {
		try {
			const new_user = await this.AuthorizationService.signUp(
				body.username,
				body.email,
				body.password
			);
			this.EmailService.sendActivationMail(
				new_user.email,
				`${process.env.SERVER_URL}/api/users/activate/` + new_user.activation_link
			);
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.UNAUTHORIZED);
		}

		return { message: 'Activation link sent. Check your e-mail for the confirmation link.' };
	}

	@Post('sign-in')
	@HttpCode(HttpStatus.OK)
	async signIn(@Body() body: SignInDto): Promise<SignInResponse> {
		let data;
		try {
			data = await this.AuthorizationService.signIn(body.username, body.password);
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.UNAUTHORIZED);
		}
		return { message: 'Welcome back!', data: data };
	}

	@Get('check')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthorizationGuard)
	checkAuthorization(@Req() req: AuthenticatedRequest): SignInResponse {
		const user = req.user;
		return {
			message: 'User is signed in',
			data: {
				access_token: req.headers['authorization'],
				user: user,
			},
		};
	}
}
