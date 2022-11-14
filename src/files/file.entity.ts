import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class File {
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

  getPath() {
    return this.destination + this.filename;
  }
}
