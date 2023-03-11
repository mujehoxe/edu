import {
	Controller,
	Get,
	StreamableFile,
	Res,
	Param,
	VERSION_NEUTRAL,
	Headers,
	HttpStatus,
} from '@nestjs/common';

import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';

import { createReadStream, stat } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { promisify } from 'util';
import { ReadStream } from 'typeorm/platform/PlatformTools';

const fileInfo = promisify(stat);

@Controller({ path: 'uploads', version: VERSION_NEUTRAL })
export class LocalFilesController {
	@Get(':filetype/:filename')
	async getFile(
		@Headers() headers,
		@Param('filetype') type: string,
		@Param('filename') filename: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const path = './uploads/' + type + '/' + filename;

		try {
			const mimeType = await detectFilePromise(path);

			res.set({
				'Content-Type': mimeType || 'application/octet-stream',
			});
		} catch (err) {
			console.log(err);
		}

		const { size } = await fileInfo(path);
		const range = headers.range;

		let file: ReadStream;

		if (range) {
			const parts = range.replace(/bytes=/, '').split('-');
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
			const chunksize = end - start + 1;

			file = createReadStream(path, { start, end, highWaterMark: 60 });
			res.writeHead(HttpStatus.PARTIAL_CONTENT, {
				'Content-Range': `bytes ${start}-${end}/${size}`,
				'Content-Length': chunksize,
			});
		} else file = createReadStream(join(process.cwd(), path));

		return new StreamableFile(file);
	}
}

const detectFilePromise = (path: string): Promise<string> => {
	const magic = new Magic(MAGIC_MIME_TYPE);

	return new Promise((resolve, reject) => {
		magic.detectFile(path, (err: Error, result: string) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
