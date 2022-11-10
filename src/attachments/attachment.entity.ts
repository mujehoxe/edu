import { Topic } from 'src/topics/topic.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalname: string;
  
  @Column()
  encoding: string;
  
  @Column()
  mimetype: string;

  @Column()
  filename: string;

  @Column()
  destination: string;
  
  @Column()
  size: number;

  @CreateDateColumn()
  createdDate: Date;
   
  @UpdateDateColumn()
  updatedDate: Date;
  
  @ManyToOne(() => Topic, (topic) => topic.attachments)
  topic: Topic;
  
  getPath() {
    return this.destination + this.filename
  }
}