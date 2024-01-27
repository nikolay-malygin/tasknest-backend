import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	user_id: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
	category_id: string;

	@Prop({ required: true })
	title: string;

	@Prop()
	description: string;

	@Prop({ required: true })
	due_date: string;

	@Prop({ required: true, enum: ['todo', 'inprogress', 'done'] })
	status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
