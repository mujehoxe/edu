import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAttachmentDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  readonly topicId: number;
}