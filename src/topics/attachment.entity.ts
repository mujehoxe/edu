import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';
import { File } from 'src/files/file.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @OneToOne(() => File, { onDelete: 'CASCADE', eager: true })
  file: File;

  @ManyToOne(() => Topic, (topic) => topic.attachments, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  topic: Topic;
}
