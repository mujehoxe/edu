import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Topic } from './topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { CoursesService } from 'src/courses/courses.service';
import { FilesService } from 'src/files/files.service';
import { Attachment } from './attachment.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,

    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,

    @Inject(CoursesService)
    private readonly coursesService: CoursesService,

    @Inject(FilesService)
    private readonly filesService: FilesService,
  ) {}

  findAll(): Promise<Topic[]> {
    return this.topicsRepository.find();
  }

  async findById(id: number): Promise<Topic> {
    const topic = await this.topicsRepository.findOne({
      where: { id },
      relations: ['attachments'],
    });
    if (!topic) {
      throw new NotFoundException(`Topic #${id} not found`);
    }
    return topic;
  }

  async create(createTopicDto: CreateTopicDto): Promise<InsertResult> {
    const course = await this.coursesService.findById(createTopicDto.courseId);

    const topic = this.topicsRepository.create({
      ...createTopicDto,
      course,
    });

    return await this.topicsRepository.insert(topic);
  }

  async update(
    id: number,
    updateTopicDto: UpdateTopicDto,
  ): Promise<UpdateResult> {
    return await this.topicsRepository.update(id, updateTopicDto);
  }

  async linkAttachment(topicId: number, file: Express.Multer.File) {
    const filename = this.filesService.generateFileName(file, topicId);

    const topic = await this.findById(topicId);

    if (topic.isAttachmentLinked(filename))
      throw new ConflictException(`The same attachment was already linked`);

    const attachment = new Attachment();

    attachment.file = await this.filesService.create(file);

    topic.attachments.push(attachment);

    await this.filesService.writeFile(file);

    return await this.topicsRepository.save(topic);
  }

  async unlinkAttachment(topicId: number, attachmentId: any) {
    const topic = await this.findById(topicId);

    const attachment = topic.findAttachmentById(attachmentId);

    if (!attachment)
      throw new NotFoundException(
        `No Attachment ${attachmentId} not associated with topic ${topicId}`,
      );

    const res = await this.attachmentsRepository.delete(attachmentId);
    await this.filesService.delete(attachment.file.id);

    return res;
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.topicsRepository.delete(id);
  }
}
