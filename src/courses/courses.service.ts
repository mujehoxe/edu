import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) { }

  findAll(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  async findById(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Course with id #${id} not found.`)
    }
    return course;
  }

  async findByName(name: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { name } });
    if (!course) {
      throw new NotFoundException(`Course with name "${name}" not found.`)
    }
    return course;
  }

  async create(createCourseDto: CreateCourseDto) {
    const { name } = createCourseDto
    const course = await this.coursesRepository.findOne({ where: { name } });

    if (!course) {
      const course = this.coursesRepository.create(createCourseDto);
      return this.coursesRepository.insert(course);
    }

    throw new ConflictException(`Course with name "${name}" already exists.`)
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.coursesRepository.update(id, updateCourseDto);
  }

  async delete(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}