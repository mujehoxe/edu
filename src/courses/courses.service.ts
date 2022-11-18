import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalFile } from 'src/local-files/local-file.entity';
import { LocalFilesService } from 'src/local-files/local-files.service';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
	constructor(
		@InjectRepository(Course)
		private coursesRepository: Repository<Course>,

		@Inject(LocalFilesService)
		private readonly filesService: LocalFilesService,
	) {}

	findAll(): Promise<Course[]> {
		return this.coursesRepository.find();
	}

	async findById(id: number): Promise<Course> {
		const course = await this.coursesRepository.findOne({
			where: { id },
			relations: ['topics'],
		});
		if (!course) throw new NotFoundException(`Course #${id} not found`);

		return course;
	}

	async create(
		createCourseDto: CreateCourseDto,
		thumbnail: Express.Multer.File,
	) {
		const { title: name } = createCourseDto;

		if (await this.isCourseRegistered(name))
			throw new ConflictException(`Course with name "${name}" already exists`);

		const course = this.coursesRepository.create(createCourseDto);

		if (thumbnail) course.thumbnail = new LocalFile(thumbnail);

		return this.coursesRepository.save(course);
	}

	private async isCourseRegistered(name: string) {
		return await this.coursesRepository.findOne({ where: { title: name } });
	}

	async update(id: number, updateCourseDto: UpdateCourseDto) {
		await this.coursesRepository.update(id, updateCourseDto);
	}

	async linkThumbnail(courseId: number, file: Express.Multer.File) {
		const course = await this.findById(courseId);

		const oldThumbnailId = course.thumbnailId ?? -1;

		course.thumbnail = new LocalFile(file);
		const res = await this.coursesRepository.save(course);

		if (oldThumbnailId > -1) this.filesService.delete(oldThumbnailId);

		return res;
	}

	async delete(id: number): Promise<void> {
		await this.coursesRepository.delete(id);
	}
}
