import { Topic } from 'src/topics/topic.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable, Unique } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @Column({nullable: true})
  description: string;
  
  @OneToMany(type => Topic, topic => topic.course, {eager: true})
  topics: Topic[];
}