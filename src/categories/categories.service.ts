import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoriesService {
	constructor(@InjectModel(Category.name) private CategoryModel: Model<Category>) {}

	async createCategory(name: string): Promise<Category> {
		const categoryExists = await this.CategoryModel.findOne({ name: name });
		if (categoryExists) {
			throw new ConflictException(`Category '${name}' already exists`);
		}

		return await this.CategoryModel.create({ name: name });
	}

	async deleteCategory(name: string) {
		return await this.CategoryModel.deleteOne({ name: name });
	}

	async getCategoryIdByName(name: string): Promise<mongoose.Types.ObjectId> {
		return (await this.CategoryModel.findOne({ name }))._id;
	}

	async getCategories(): Promise<Category[]> {
		return await this.CategoryModel.find();
	}
}
