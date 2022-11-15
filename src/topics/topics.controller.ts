import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { Topic } from './topic.entity';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('topics')
export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  @Post()
  async create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  async findAll(): Promise<Topic[]> {
    return this.topicsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Topic> {
    return this.topicsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Post(':topicId/link-attachment')
  @UseInterceptors(FileInterceptor('file'))
  linkAttachment(
    @Param('topicId') topicId: number,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    return this.topicsService.linkAttachment(topicId, file);
  }

  @Delete(':topicId/unlink-attachment/:attachmentId')
  unlinkAttachment(
    @Param('topicId') topicId: number,
    @Param('attachmentId') attachmentId: number,
  ) {
    return this.topicsService.unlinkAttachment(topicId, attachmentId);
  }

  @Delete(':id')
  async detete(@Param('id') id: number) {
    return this.topicsService.delete(id);
  }
}
