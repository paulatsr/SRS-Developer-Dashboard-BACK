import { ApiProperty } from '@nestjs/swagger';

export class UploadFilesDto {
  @ApiProperty({
    description: 'Technical specification PDF file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  technical_file?: Express.Multer.File;

  @ApiProperty({
    description: 'Project icon image file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  icon?: Express.Multer.File;
}
