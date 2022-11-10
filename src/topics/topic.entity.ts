import { Attachment } from 'src/attachments/attachment.entity';
import { Course } from 'src/courses/course.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Attachment,
    (attchment) => attchment.topic,
    { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  attachments: Attachment[];

  IsAttachmentLinked(filename: string) {
    for(const attachment of this.attachments) {
      if (filename === attachment.filename)
        return true
    }
    return false;
  }

}