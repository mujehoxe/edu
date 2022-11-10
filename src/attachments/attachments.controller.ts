import { Controller, Delete, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Attachment } from './attachment.entity';
import { AttachmentsService } from './attachments.service';
import { createReadStream } from 'fs';
import type { Response } from 'express';


@Controller('attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) { }

  @Get()
  async findAll(): Promise<Attachment[]> {
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  async getId(@Param('id') id: number, 
      @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    const attachment = await this.attachmentsService.findById(id);

    const file = createReadStream(attachment.getPath());

    res.set({
      'Content-Type': attachment.mimetype,
      // 'Content-Disposition': `attachment; filename="${attachment.originalname}"`,
    });
    
    return new StreamableFile(file);
  }


  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.attachmentsService.delete(id);
  }
}