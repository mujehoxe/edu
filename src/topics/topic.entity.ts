import { Attachment } from 'src/attachments/attachment.entity';
import { Course } from 'src/courses/course.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Course, (course) => course.topics,
    { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  course: Course
  
  @JoinTable({name: 'topics_attachments'})
  @ManyToMany(() => Attachment)
  attachments: Attachment[];
}