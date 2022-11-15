import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { TopicsModule } from './topics/topics.module';
import { LocalFilesModule } from './local-files/local-files.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'secret',
      database: 'edu',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoursesModule,
    TopicsModule,
    LocalFilesModule,
  ],
})
export class AppModule {}
