import { Topic } from 'src/topics/topic.entity';
import { LocalFile } from 'src/local-files/local-file.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @JoinColumn()
  @OneToOne(() => LocalFile, { nullable: true, cascade: true })
  thumbnail?: LocalFile;

  @Column({ nullable: true })
  thumbnailId?: number;

  @OneToMany(() => Topic, (topic) => topic.course)
  topics: Topic[];
}
