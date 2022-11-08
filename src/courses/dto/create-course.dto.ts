import { IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString()
  readonly name: string;
  
  @IsString()
  @IsOptional()
  readonly description?: string;
}