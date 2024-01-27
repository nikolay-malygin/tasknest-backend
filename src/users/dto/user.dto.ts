import * as mongoose from "mongoose";

export class UserDto {
	id: mongoose.Types.ObjectId;
	username: string;
	email: string;

	constructor(id: mongoose.Types.ObjectId, username: string, email: string) {
		this.id = id;
		this.username = username;
		this.email = email;
	}
}
