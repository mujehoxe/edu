import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { Topic } from './topic.entity';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('topics')
export class TopicsController {
  constructor(private topicsService: TopicsService) { }

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
  async update(@Param('id') id: number,
    @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @Post('link-attachment/:id')
  @UseInterceptors(FileInterceptor('file'))
  linkAttachment(@Param('id') topicId: number,
    @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.topicsService.linkAttachment(topicId, file);
  }

  @Delete(':id')
  async detete(@Param('id') id: number) {
    return this.topicsService.delete(id);
  }
}