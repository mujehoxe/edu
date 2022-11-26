import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { LocalFile } from './local-file.entity';
import { UpdateLocalFileDto } from './dto/update-local-file.dto';

import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class LocalFilesService {
	constructor(
		@InjectRepository(LocalFile)
		private filesRepository: Repository<LocalFile>,
	) {}

	findAll(): Promise<LocalFile[]> {
		return this.filesRepository.find();
	}

	async findById(id: number): Promise<LocalFile> {
		const attachment = await this.filesRepository.findOneBy({ id });
		if (!attachment) {
			throw new NotFoundException(`File #${id} not found`);
		}
		return attachment;
	}

	async create(file: Express.Multer.File): Promise<LocalFile> {
		const persistFile = await this.filesRepository.create(new LocalFile(file));
		this.filesRepository.save(persistFile);
		return persistFile;
	}

	async update(
		id: number,
		updateLocalFileDto: UpdateLocalFileDto,
	): Promise<UpdateResult> {
		return await this.filesRepository.update(id, updateLocalFileDto);
	}

	static async doesFileExists(path) {
		try {
			await fs.promises.access(path);
			return true;
		} catch (err) {
			if (err.code === 'ENOENT') {
				return false;
			} else {
				throw err;
			}
		}
	}

	async doesDirectoryExist(path) {
		try {
			await fs.promises.access(path);
			return true;
		} catch {
			return false;
		}
	}

	calculateHash(file: Express.Multer.File, topicId: number) {
		const newBuffer = Buffer.concat([
			file.buffer,
			Buffer.from(topicId.toString()),
			Buffer.from(file.originalname),
		]);

		const hash = crypto.createHash('md5');
		hash.update(newBuffer);
		return hash.digest('hex');
	}

	async writeFile(file: Express.Multer.File) {
		try {
			if (!(await this.doesDirectoryExist(file.destination))) {
				await fs.promises.mkdir(file.destination, { recursive: true });
			}

			await fs.promises.writeFile(
				file.destination + file.filename,
				file.buffer,
			);
		} catch (err) {
			console.log(err);
			throw new InternalServerErrorException(`Couldn't create file:`);
		}
	}

	generateFileName(file, destination, topicId) {
		const filename = this.calculateHash(file, topicId);
		file.filename = filename;
		file.destination = destination;
		return filename;
	}

	async delete(id: number): Promise<DeleteResult> {
		const file = await this.findById(id);
		await this.removeFile(file.getPath());
		return await this.filesRepository.delete(id);
	}

	async removeFile(filepath) {
		try {
			await fs.promises.unlink(filepath);
		} catch (err) {
			if (err.code === 'ENOENT') {
				throw new NotFoundException('File not found');
			}
		}
	}
}
