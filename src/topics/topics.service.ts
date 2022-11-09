import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Topic } from './topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,

    @Inject(CoursesService)
    private readonly coursesService: CoursesService,
  ) { }

  findAll(): Promise<Topic[]> {
    return this.topicsRepository.find();
  }

  async findById(id: number): Promise<Topic> {
    const topic = await this.topicsRepository.findOneBy({ id });
    if (!topic) {
      throw new NotFoundException(`Topic with id #${id} not found.`)
    }
    return topic;
  }

  async create(createTopicDto: CreateTopicDto): Promise<InsertResult> {
    const course = await this.coursesService.findById(createTopicDto.courseId)

    const topic = this.topicsRepository.create({
      ...createTopicDto,
      course
    });

    return await this.topicsRepository.insert(topic);
  }

  async update(id: number, updateTopicDto: UpdateTopicDto)
    : Promise<UpdateResult> {
    return await this.topicsRepository.update(id, updateTopicDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.topicsRepository.delete(id);
  }
}