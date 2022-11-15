import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocalFileDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  readonly size: number;
}
