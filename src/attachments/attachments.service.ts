import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Attachment } from './attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,

    @Inject(CoursesService)
    private readonly topicsService: CoursesService,
  ) { }

  findAll(): Promise<Attachment[]> {
    return this.attachmentsRepository.find();
  }

  async findById(id: number): Promise<Attachment> {
    const attachment = await this.attachmentsRepository.findOneBy({ id });
    if (!attachment) {
      throw new NotFoundException(`Attachment with id #${id} not found.`)
    }
    return attachment;
  }

  async create(createAttachmentDto: CreateAttachmentDto): Promise<InsertResult> {
    const course = await this.topicsService.findById(createAttachmentDto.topicId)

    const attachment = this.attachmentsRepository.create({
      ...createAttachmentDto,
      course
    });

    return await this.attachmentsRepository.insert(attachment);
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto)
    : Promise<UpdateResult> {
    return await this.attachmentsRepository.update(id, updateAttachmentDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.attachmentsRepository.delete(id);
  }
}