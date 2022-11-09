import { Attachment } from 'src/attachments/attachment.entity';
import { Course } from 'src/courses/course.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Course, (course) => course.topics,
    { onDelete: "CASCADE", orphanedRowAction: 'delete' })
  course: Course
  
  @JoinTable()
  @ManyToMany(type => Attachment, attachment => attachment.topics)
  attachments: Attachment[]
}