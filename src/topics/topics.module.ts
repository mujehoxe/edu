import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalFilesModule } from 'src/local-files/local-files.module';
import { CoursesModule } from 'src/courses/courses.module';
import { Topic } from './topic.entity';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { Attachment } from './attachment.entity';

@Module({
	imports: [
		CoursesModule,
		LocalFilesModule,
		TypeOrmModule.forFeature([Topic, Attachment]),
	],
	exports: [TypeOrmModule],
	controllers: [TopicsController],
	providers: [TopicsService],
})
export class TopicsModule {}
