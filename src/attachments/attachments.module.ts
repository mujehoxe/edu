import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicsModule } from 'src/topics/topics.module';
import { Attachment } from './attachment.entity';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attachment])],
  exports: [AttachmentsService, TypeOrmModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService]
})
export class AttachmentsModule { }
