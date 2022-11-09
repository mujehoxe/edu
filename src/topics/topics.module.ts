import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentsModule } from 'src/attachments/attachments.module';
import { CoursesModule } from 'src/courses/courses.module';
import { Topic } from './topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';

@Module({
  imports: [CoursesModule, AttachmentsModule, TypeOrmModule.forFeature([Topic])],
  exports: [TypeOrmModule],
  controllers: [TopicsController],
  providers: [TopicsService]
})
export class TopicsModule { }