import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddTeamMemberDto {
  @ApiProperty({
    description: 'Account ID of the user to add to the project',
    example: 'clx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({
    description: 'Role of the user in this project',
    example: 'Frontend Developer',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
}
