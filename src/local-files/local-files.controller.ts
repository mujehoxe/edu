import {
	Controller,
	Get,
	StreamableFile,
	Res,
	Param,
	VERSION_NEUTRAL,
} from '@nestjs/common';

import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';

import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller({ path: 'uploads', version: VERSION_NEUTRAL })
export class LocalFilesController {
	@Get(':filetype/:filename')
	async getFile(
		@Param('filetype') type: string,
		@Param('filename') filename: string,
		@Res({ passthrough: true }) res: Response,
	): Promise<StreamableFile> {
		const path = './uploads/' + type + '/' + filename;

		const file = createReadStream(join(process.cwd(), path));

		try {
			const mimeType = await detectFilePromise(path);

			res.set({
				'Content-Type': mimeType || 'application/octet-stream',
				// 'Content-Disposition': 'attachment; filename="package.json"',
			});
		} catch (err) {
			console.log(err);
		}

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
