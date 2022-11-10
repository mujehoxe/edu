import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Topic } from './topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CoursesService } from 'src/courses/courses.service';
import { AttachmentsService } from 'src/attachments/attachments.service';


@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,

    @Inject(CoursesService)
    private readonly coursesService: CoursesService,
    
    @Inject(AttachmentsService)
    private readonly attachmentsService: AttachmentsService,
  ) { }

  findAll(): Promise<Topic[]> {
    return this.topicsRepository.find();
  }

  async findById(id: number): Promise<Topic> {
    const topic = await this.topicsRepository.findOne(
      { where: { id }, relations: ['attachments'] });
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

  async linkAttachment(topicId: number, file: Express.Multer.File) {
    
    const filename = this.attachmentsService.generateFileName(file, topicId)

    const topic = await this.findById(topicId);

    if (topic.IsAttachmentLinked(filename))
      throw new ConflictException(`The same attachment was already linked.`)

    await this.attachmentsService.writeFile(file, filename);

    const attachment = await this.attachmentsService.create(file);

    topic.attachments.push(attachment);

    return await this.topicsRepository.save(topic);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.topicsRepository.delete(id);
  }
}