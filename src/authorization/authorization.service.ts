import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../users/dto/user.dto';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationService {
	constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

	async signUp(username: string, email: string, password: string): Promise<User> {
		const emailExists = await this.UserModel.findOne({ email });
		if (emailExists) {
			throw new ConflictException(`There is already a user with email ${email}`);
		}

		const usernameExists = await this.UserModel.findOne({ username });
		if (usernameExists) {
			throw new ConflictException(`There is already a user with username ${username}`);
		}

		const password_hash = await bcrypt.hash(password, 3);
		const activation_link = uuid.v4();

		const newUser = await this.UserModel.create({
			username,
			email,
			password: password_hash,
			activation_link: activation_link,
		});

		return newUser;
	}

	async signIn(username: string, password: string): Promise<any> {
		const user = await this.UserModel.findOne({ username: username });

		if (!user) {
			throw new Error('Invalid username');
		}

		if (!user.is_activated) {
			throw new Error('Your account is not activated, check your E-Mail for activation link');
		}

		const isPassEqual = await bcrypt.compare(password, user.password);
		if (!isPassEqual) {
			throw new Error('Invalid password');
		}

		const user_dto = new UserDto(user._id, user.username, user.email);

		const access_token = this.generateToken({
			...user_dto,
		});

		return { access_token, user: user_dto };
	}

	private generateToken(payload: UserDto) {
		const access_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
			expiresIn: '30m',
		});
		return access_token;
	}
}
