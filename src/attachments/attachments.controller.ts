import { Controller, Delete, Get, Param } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Attachment } from './attachment.entity';
import { AttachmentsService } from './attachments.service';


@Controller('attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) { }

  @Get()
  async findAll(): Promise<Attachment[]> {
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Attachment> {
    return this.attachmentsService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.attachmentsService.delete(id);
  }
}