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
} from '@nestjs/common';
import { Category } from '../schemas/category.schema';
import { CategoriesService } from './categories.service';
import { createCategoryDto } from './dto/create-category.dto';
import { CategoryResponse } from './dto/response.dto';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly CategoryService: CategoriesService) {}

	@Post('create')
	@HttpCode(HttpStatus.CREATED)
	async createCategory(@Body() body: createCategoryDto): Promise<Category | CategoryResponse> {
		try {
			return this.CategoryService.createCategory(body.name);
		} catch (error) {
			throw new HttpException({ message: error.message }, HttpStatus.CONFLICT);
		}
	}

	@Delete('delete/:name')
	@HttpCode(HttpStatus.OK)
	async deleteCategory(@Param('name') name: string) {
		return this.CategoryService.deleteCategory(name);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getCategories(): Promise<Category[]> {
		return await this.CategoryService.getCategories();
	}
}
