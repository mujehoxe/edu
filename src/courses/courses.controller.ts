import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	ParseFilePipe,
	FileTypeValidator,
	BadRequestException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const fileInterceptor = FileInterceptor('file', {
	storage: diskStorage({ destination: 'uploads/thumbnails/' }),
});

@Controller('courses')
export class CoursesController {
	constructor(private coursesService: CoursesService) {}

	@Post()
	@UseInterceptors(fileInterceptor)
	async create(
		@Body() createCourseDto: CreateCourseDto,
		@UploadedFile(
			new ParseFilePipe({
				exceptionFactory(err) {
					if (err)
						throw new BadRequestException('Must provide a jpg, jpeg or png');
				},
				validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
			}),
		)
		thumnail: Express.Multer.File,
	) {
		return this.coursesService.create(createCourseDto, thumnail);
	}

	@Get()
	async findAll(): Promise<Course[]> {
		return this.coursesService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: number): Promise<Course> {
		return this.coursesService.findById(id);
	}

	@Patch(':id')
	async update(
		@Param('id') id: number,
		@Body() updateCourseDto: UpdateCourseDto,
	) {
		return this.coursesService.update(id, updateCourseDto);
	}

	@Post(':courseId/link-thumbnail')
	@UseInterceptors(fileInterceptor)
	linkThumbnail(
		@Param('courseId') courseId: number,
		@UploadedFile(
			new ParseFilePipe({
				fileIsRequired: true,
				exceptionFactory(err) {
					if (err) throw new BadRequestException('Must provide an image');
				},
				validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
			}),
		)
		file: Express.Multer.File,
	) {
		return this.coursesService.linkThumbnail(courseId, file);
	}

	@Delete(':id')
	async detete(@Param('id') id: number) {
		return this.coursesService.delete(id);
	}
}
