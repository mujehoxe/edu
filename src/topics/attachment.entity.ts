import {
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { LocalFile } from 'src/local-files/local-file.entity';

@Entity()
export class Attachment {
	@PrimaryGeneratedColumn()
	id: number;

	@JoinColumn()
	@OneToOne(() => LocalFile, { onDelete: 'CASCADE', eager: true })
	file: LocalFile;

	@ManyToOne(() => Topic, (topic) => topic.attachments, {
		onDelete: 'CASCADE',
		orphanedRowAction: 'delete',
	})
	topic: Topic;
}
