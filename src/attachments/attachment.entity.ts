import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column()
  encoding: string;
  
  @Column()
  mimetype: string;

  @Column()
  path: string;
  
  @Column()
  size: number;

  @CreateDateColumn()
  createdDate: Date;
   
  @UpdateDateColumn()
  updatedDate: Date;
}