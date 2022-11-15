import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LocalFile {
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

  constructor();
  constructor(file: Express.Multer.File);
  constructor(file?: Express.Multer.File) {
    if (file) {
      this.originalname = file.originalname;
      this.encoding = file.encoding;
      this.mimetype = file.mimetype;
      this.filename = file.filename;
      this.destination = file.destination;
      this.size = file.size;
    }
  }

  getPath() {
    return this.destination + this.filename;
  }
}
