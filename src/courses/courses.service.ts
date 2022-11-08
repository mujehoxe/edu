import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  findAll(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOneBy({ id });
    if(!course){
      throw new NotFoundException(`Course with id #${id} not found.`)
    }
    return course;
  }

  create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    return this.coursesRepository.insert(course);
  }
  
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    await this.coursesRepository.update(id, updateCourseDto);
  }

  async delete(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}