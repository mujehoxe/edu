import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalFilesModule } from 'src/local-files/local-files.module';
import { Course } from './course.entity';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
	imports: [LocalFilesModule, TypeOrmModule.forFeature([Course])],
	exports: [CoursesService, TypeOrmModule],
	controllers: [CoursesController],
	providers: [CoursesService],
})
export class CoursesModule {}
