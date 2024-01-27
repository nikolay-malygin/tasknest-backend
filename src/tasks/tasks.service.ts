import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from '../categories/categories.service';
import { Task } from '../schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';

@Injectable()
export class TasksService {
	constructor(
		@InjectModel(Task.name) private TaskModel: Model<Task>,
		private readonly CategoryService: CategoriesService
	) {}

	async createTask(body: CreateTaskDto) {
		const category_id = await this.CategoryService.getCategoryIdByName(body.category);
		return await this.TaskModel.create({ ...body, category_id });
	}

	async deleteTask(id: string) {
		return await this.TaskModel.deleteOne({ _id: id });
	}

	async editTask(task_id: string, editTaskDto: EditTaskDto): Promise<Task> {
		const updatedTask = await this.TaskModel.findOneAndUpdate(
			{ _id: task_id },
			{
				$set: {
					...editTaskDto,
					category_id: await this.CategoryService.getCategoryIdByName(
						editTaskDto.category
					),
				},
			},
			{ new: true }
		);

		if (!updatedTask) {
			throw new NotFoundException(`Task with id ${task_id} not found`);
		}

		return updatedTask;
	}

	async getTasks(queryConfig: { [key: string]: any }): Promise<Task[]> {
		try {
			return await this.TaskModel.find(queryConfig).populate('category_id', 'name').exec();
		} catch (error) {
			if (error.name === 'CastError' && error.kind === 'ObjectId') {
				throw new NotFoundException('Invalid user ID');
			}
			throw error;
		}
	}
}
