import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalFile } from './local-file.entity';
import { LocalFilesController } from './local-files.controller';
import { LocalFilesService } from './local-files.service';

@Module({
	imports: [TypeOrmModule.forFeature([LocalFile])],
	exports: [LocalFilesService, TypeOrmModule],
	controllers: [LocalFilesController],
	providers: [LocalFilesService],
})
export class LocalFilesModule {}
