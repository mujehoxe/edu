import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async create(file: Express.Multer.File): Promise<Attachment> {
    const attachment: Attachment = await this.attachmentsRepository.create({
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      filename: file.filename,
      destination: file.destination,
      size: file.size,
    });

    return attachment;
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto)
    : Promise<UpdateResult> {
    return await this.attachmentsRepository.update(id, updateAttachmentDto);
  }

  async fileExists(filename) {
    try {
      await fs.promises.access(filename);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    }
  }

  calculateHash(file: Express.Multer.File, topicId: number) {
    const newBuffer = Buffer.concat(
      [file.buffer
        , Buffer.from(topicId.toString())
        , Buffer.from(file.originalname)]);

    const hash = crypto.createHash('md5');
    hash.update(newBuffer);
    return hash.digest('hex');
  }

  async writeFile(file: Express.Multer.File, name: string) {
    try {
      await fs.promises.writeFile(file.destination + file.filename, file.buffer)
    }
    catch (err) {
      throw new InternalServerErrorException(`Couldn't create file.`);
    }
  }

  generateFileName(file, topicId){
    const filename = this.calculateHash(file, topicId); 
    file.filename = filename;
    file.destination = 'uploads/attachments/';
    return filename;
  }

  async delete(id: number): Promise<DeleteResult>{
    const attachment = await this.findById(id);
    this.removeFile(attachment.getPath());
    return await this.attachmentsRepository.delete(id);
  }

  async removeFile(filepath) {
    try {
      await fs.promises.unlink(filepath)
    }
    catch (err) {
      if (err.code === 'ENOENT') {
        throw new NotFoundException('File not found.')
      }
    }
  }
}