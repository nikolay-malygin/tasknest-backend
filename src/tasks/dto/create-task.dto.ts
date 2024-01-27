import mongoose from "mongoose";

export class CreateTaskDto {
	user_id: mongoose.Types.ObjectId;
	category: string;
	title: string;
	description: string;
	due_date: string;
	status: string;
}
