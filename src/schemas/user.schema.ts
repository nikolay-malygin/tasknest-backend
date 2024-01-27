import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// Function to format the date, e.g. "Sun, 31.12.2023, 12:17"
const formatDate = () => {
	const date = new Date();
	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const dayOfWeek = daysOfWeek[date.getUTCDay()];
	const dayOfMonth = date.getUTCDate();
	const month = date.getUTCMonth() + 1;
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${dayOfWeek}, ${dayOfMonth}.${month}.${year}, ${hours}:${minutes}`;
};

@Schema()
export class User {
	@Prop({ required: true, unique: true })
	username: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true, default: formatDate })
	creation_date: string;

	@Prop({ required: true })
	activation_link: string;

	@Prop({ required: true, default: false })
	is_activated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
