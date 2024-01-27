import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Task } from '../schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { TaskResponse } from './dto/task-response.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
	constructor(
		private readonly TaskService: TasksService,
		private readonly CategoryService: CategoriesService
	) {}

	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthorizationGuard)
	async createTask(@Body() body: CreateTaskDto): Promise<TaskResponse | any> {
		try {
			const task = await this.TaskService.createTask(body);
			return {
				task: task,
				message: 'Task created successfully',
			};
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.CONFLICT);
		}
	}

	@Delete('delete/:id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthorizationGuard)
	async deleteTask(@Param('id') id: string): Promise<TaskResponse> {
		try {
			await this.TaskService.deleteTask(id);
			return { message: 'Task deleted successfully' };
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.CONFLICT);
		}
	}

	@Get('/:user_id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthorizationGuard)
	async getTasks(
		@Query('category') category: string,
		@Query('status') status: string,
		@Param('user_id') user_id: string
	): Promise<Task[] | TaskResponse> {
		try {
			const queryConfig: { [key: string]: any } = { user_id };

			if (category) {
				queryConfig.category_id = await this.CategoryService.getCategoryIdByName(category);
			}
			if (status) {
				queryConfig.status = status;
			}

			return this.TaskService.getTasks(queryConfig);
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
		}
	}

	@Put('edit/:id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthorizationGuard)
	async editTask(
		@Param('id') task_id: string,
		@Body() new_task: EditTaskDto
	): Promise<TaskResponse> {
		try {
			await this.TaskService.editTask(task_id, new_task);
			return { message: 'Task updated successfully' };
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.CONFLICT);
		}
	}
}
