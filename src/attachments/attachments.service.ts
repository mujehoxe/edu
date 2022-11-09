import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicsService } from 'src/topics/topics.service';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Attachment } from './attachment.entity';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

import * as crypto from "crypto";
import * as fs from 'fs';


@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private attachmentsRepository: Repository<Attachment>,

    @Inject(TopicsService)
    private readonly topicsService: TopicsService,
  ) { }

  private readonly hash = crypto.createHash('md5');

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

  async create(file: Express.Multer.File): Promise<InsertResult> {
    const date = new Date();

    const attachment = this.attachmentsRepository.create({
      name: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
      createdDate: date,
      updatedDate: date
    });
    return await this.attachmentsRepository.insert(attachment);
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto)
    : Promise<UpdateResult> {
    return await this.attachmentsRepository.update(id, updateAttachmentDto);
  }

  async deleteFromDb(id: number): Promise<DeleteResult> {
    return await this.attachmentsRepository.delete(id);
  }

  async removeFile(attachmentId) {
    const attachment = await this.findById(attachmentId);
    if (attachment) {
      try {
        await fs.promises.unlink(attachment.path)
      }
      catch (err) {
        throw err
      }
    }

    return this.deleteFromDb(attachmentId);
  }
}