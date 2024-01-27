import mongoose from 'mongoose';

export class EditTaskDto {
	user_id: mongoose.Types.ObjectId;
	category: string;
	title: string;
	description: string;
	due_date: string;
	status: string;
}