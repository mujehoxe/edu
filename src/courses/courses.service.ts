import {
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalFile } from 'src/local-files/local-file.entity';
import { LocalFilesService } from 'src/local-files/local-files.service';
import { QueryFailedError, Repository } from 'typeorm';
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
		return this.coursesRepository.find({ relations: ['thumbnail'] });
	}

	async findById(id: number): Promise<Course> {
		const course = await this.coursesRepository.findOne({
			where: { id },
			relations: ['topics', 'thumbnail'],
		});

		this.exceptionCourseNotFound(course, id);
		return course;
	}

	private exceptionCourseNotFound(course: Course, id: number) {
		if (!course) throw new NotFoundException(`Course #${id} not found`);
	}

	async create(
		createCourseDto: CreateCourseDto,
		thumbnail: Express.Multer.File,
	) {
		if (thumbnail) createCourseDto.thumbnail = new LocalFile(thumbnail);

		const course = this.coursesRepository.create(createCourseDto);

		return this.saveAndHandleErrors(course);
	}

	private async isCourseRegistered(name: string) {
		return await this.coursesRepository.findOne({ where: { title: name } });
	}

	async update(
		id: number,
		updateCourseDto: UpdateCourseDto,
		thumbnail: Express.Multer.File,
	) {
		if (thumbnail) updateCourseDto.thumbnail = new LocalFile(thumbnail);

		updateCourseDto.id = id;

		return this.saveAndHandleErrors(updateCourseDto);
	}

	async saveAndHandleErrors(courseData) {
		try {
			return await this.coursesRepository.save(courseData);
		} catch (err) {
			if (
				!(err instanceof QueryFailedError) ||
				err.driverError.code !== '23505'
			)
				throw err;

			if (err.driverError.code === '23505')
				throw new ConflictException(
					`Course with name "${courseData.title}" already exists`,
				);
		}
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
