import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsOptional()
	readonly description?: string;

	@IsOptional()
	readonly category: string;

	@IsOptional()
	level: string;

	@IsOptional()
	speciality: string;
}
