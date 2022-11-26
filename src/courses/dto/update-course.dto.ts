import { PartialType } from '@nestjs/mapped-types';
import { IsPositive } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
	id: number;
}
