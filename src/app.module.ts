import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesModule } from './courses/courses.module';
import { TopicsModule } from './topics/topics.module';
import { LocalFilesModule } from './local-files/local-files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../..', 'public/dist'),
		}),
		CoursesModule,
		TopicsModule,
		LocalFilesModule,
	],
})
export class AppModule {}
