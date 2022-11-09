import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { TopicsModule } from './topics/topics.module';
import { AttachmentsModule } from './attachments/attachments.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'secret',
    database: 'edu',
    autoLoadEntities: true,
    synchronize: true,
  }), CoursesModule, TopicsModule, AttachmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
