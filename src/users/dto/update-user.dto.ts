import { UserRole } from '../user-roles.unum';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsOptional()
  bio: string;

  @ApiProperty()
  @IsOptional()
  role: UserRole;

  @ApiProperty()
  @IsOptional()
  status: boolean;
}
