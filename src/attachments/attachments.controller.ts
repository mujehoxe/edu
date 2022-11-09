import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './attachment.entity';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Controller('attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) { }

  @Post()
  async create(@Body() createAttachmentDto: CreateAttachmentDto) {
    return this.attachmentsService.create(createAttachmentDto);
  }

  @Get()
  async findAll(): Promise<Attachment[]> {
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Attachment> {
    return this.attachmentsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number,
    @Body() updateAttachmentDto: UpdateAttachmentDto) {
    return this.attachmentsService.update(id, updateAttachmentDto);
  }

  @Delete(':id')
  async detete(@Param('id') id: number) {
    return this.attachmentsService.delete(id);
  }
}