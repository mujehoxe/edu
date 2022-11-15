import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsString()
	@IsOptional()
	readonly description?: string;

	@IsNumber()
	readonly courseId: number;
}
