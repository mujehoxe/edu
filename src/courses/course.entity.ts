import { Topic } from 'src/topics/topic.entity';
import { LocalFile } from 'src/local-files/local-file.entity';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	OneToOne,
	JoinColumn,
	UpdateDateColumn,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Course {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	title: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	category: string;

	@Column({ nullable: true })
	level: string;

	@Column({ nullable: true })
	speciality: string;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	updatedDate: Date;

	@JoinColumn()
	@OneToOne(() => LocalFile, { nullable: true, cascade: true })
	thumbnail?: LocalFile;

	@Column({ nullable: true })
	thumbnailId?: number;

	@OneToMany(() => Topic, (topic) => topic.course)
	topics: Topic[];
}
