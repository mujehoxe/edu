import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { File } from './file.entity';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
  ) {}

  findAll(): Promise<File[]> {
    return this.filesRepository.find();
  }

  async findById(id: number): Promise<File> {
    const attachment = await this.filesRepository.findOneBy({ id });
    if (!attachment) {
      throw new NotFoundException(`Attachment with id #${id} not found`);
    }
    return attachment;
  }

  async create(file: Express.Multer.File): Promise<File> {
    const persistFile = await this.filesRepository.create({
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      filename: file.filename,
      destination: file.destination,
      size: file.size,
    });

    this.filesRepository.save(persistFile);
    return persistFile;
  }

  async update(
    id: number,
    updateAttachmentDto: UpdateAttachmentDto,
  ): Promise<UpdateResult> {
    return await this.filesRepository.update(id, updateAttachmentDto);
  }

  async doesFileExists(path) {
    try {
      await fs.promises.access(path);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    }
  }

  async doesDirectoryExist(path) {
    try {
      await fs.promises.access(path);
      return true;
    } catch {
      return false;
    }
  }

  calculateHash(file: Express.Multer.File, topicId: number) {
    const newBuffer = Buffer.concat([
      file.buffer,
      Buffer.from(topicId.toString()),
      Buffer.from(file.originalname),
    ]);

    const hash = crypto.createHash('md5');
    hash.update(newBuffer);
    return hash.digest('hex');
  }

  async writeFile(file: Express.Multer.File) {
    try {
      if (!(await this.doesDirectoryExist(file.destination))) {
        await fs.promises.mkdir(file.destination, { recursive: true });
      }

      await fs.promises.writeFile(
        file.destination + file.filename,
        file.buffer,
      );
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(`Couldn't create file:`);
    }
  }

  generateFileName(file, topicId) {
    const filename = this.calculateHash(file, topicId);
    file.filename = filename;
    file.destination = 'uploads/attachments/';
    return filename;
  }

  async delete(id: number): Promise<DeleteResult> {
    const file = await this.findById(id);
    await this.removeFile(file.getPath());
    return await this.filesRepository.delete(id);
  }

  async removeFile(filepath) {
    try {
      await fs.promises.unlink(filepath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new NotFoundException('File not found');
      }
    }
  }
}
