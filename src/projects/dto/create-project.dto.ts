import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsNumber,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Website Redesign',
  })
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @ApiProperty({
    description: 'Name of the customer',
    example: 'Customer',
  })
  @IsString()
  @IsNotEmpty()
  customer_name: string;

  @ApiProperty({
    description: 'Project description',
    example: 'Example of project description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Project start date',
    example: '2024-01-01T00:00:00Z',
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'Project end date',
    example: '2024-06-01T00:00:00Z',
  })
  @IsDateString()
  end_date: string;

  @ApiProperty({
    description: 'Maximum number of frontend developers',
    example: 2,
    minimum: 0,
  })
  @IsInt()
  max_people_front: number;

  @ApiProperty({
    description: 'Maximum number of backend developers',
    example: 3,
    minimum: 0,
  })
  @IsInt()
  max_people_back: number;

  @ApiProperty({
    description: 'Project budget',
    example: 50000.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  budget?: number;
}
