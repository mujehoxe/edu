import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, GoneException, NotFoundException } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { Attachment } from './attachment.entity';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {dest: 'uploads/attachments'}))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.attachmentsService.create(file);
  }

  @Get()
  async findAll(): Promise<Attachment[]> {
    return this.attachmentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Attachment> {
    return this.attachmentsService.findById(id);
  }

  @Delete(':id')
  async detete(@Param('id') id: number) {
    try{
      return await this.attachmentsService.removeFile(id);
    }
    catch (err) {
      console.log(err)
      if (err.code === 'ENOENT'){
        throw new NotFoundException("Attachment not found on the server");
      }
    }
  }
}