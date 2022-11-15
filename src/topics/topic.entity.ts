import { Attachment } from 'src/topics/attachment.entity';
import { Course } from 'src/courses/course.entity';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Topic {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column({ nullable: true })
	description: string;

	@ManyToOne(() => Course, (course) => course.topics, {
		onDelete: 'CASCADE',
		orphanedRowAction: 'delete',
	})
	course: Course;

	@OneToMany(
		() => Attachment,
		(attchment) => {
			return attchment.topic;
		},
		{
			cascade: true,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	)
	attachments: Attachment[];

	findAttachmentById(attachmentId: number) {
		for (const attachment of this.attachments) {
			if (attachmentId === attachment.id) return attachment;
		}

		return null;
	}

	isAttachmentLinked(filename: string) {
		for (const attachment of this.attachments) {
			if (filename === attachment.file.filename) return true;
		}
		return false;
	}
}
