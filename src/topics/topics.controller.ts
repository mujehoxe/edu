import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicsService } from './topics.service';
import { Topic } from './topic.entity';
import { UpdateTopicDto } from './dto/update-topic.dto';

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

  @Patch('link-attachment/:topicId/:attachmentId')
  async linkAttachment(@Param('topicId') topicId: number,
    @Param('attachmentId') attachmentId: number) {
    return this.topicsService.linkAttachment(topicId, attachmentId);
  }

  @Delete(':id')
  async detete(@Param('id') id: number) {
    return this.topicsService.delete(id);
  }
}