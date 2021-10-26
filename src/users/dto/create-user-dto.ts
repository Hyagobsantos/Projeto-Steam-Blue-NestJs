import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(20)
  data_aniversario: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  passwordConfirmation: string;
}
