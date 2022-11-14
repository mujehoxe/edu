import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './file.entity';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  exports: [FilesService, TypeOrmModule],
  providers: [FilesService],
})
export class FilesModule {}
