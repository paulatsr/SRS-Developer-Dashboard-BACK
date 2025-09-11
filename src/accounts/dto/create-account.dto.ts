import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export class CreateAccountDto {
  @ApiProperty({
    description: 'Username email address',
    example: 'example@company.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password for the account',
    example: 'StrongPassword123!',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: Role,
    example: Role.DEVELOPER,
  })
  @IsEnum(Role)
  role: Role;
}
