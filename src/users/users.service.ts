import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

	async activateAccount(link: string): Promise<void> {
		const user = await this.UserModel.findOne({ activation_link: link });

		if (!user) {
			throw new ConflictException('Invalid activation link');
		}

		if (user.is_activated) {
			throw new ConflictException('The account is already activated');
		}

		user.is_activated = true;
		await user.save();
	}
}
