import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { UploadFilesDto } from './dto/upload-files.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiBody({ type: CreateProjectDto })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateProjectDto })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/team')
  @ApiOperation({ summary: 'Add team member to project' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: AddTeamMemberDto })
  addTeamMember(
    @Param('id') projectId: string,
    @Body() addTeamMemberDto: AddTeamMemberDto,
  ) {
    return this.projectsService.addTeamMember(
      projectId,
      addTeamMemberDto.accountId,
      addTeamMemberDto.role,
    );
  }

  @Delete(':id/team/:accountId')
  @ApiOperation({ summary: 'Remove team member from project' })
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'accountId' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTeamMember(
    @Param('id') projectId: string,
    @Param('accountId') accountId: string,
  ) {
    return this.projectsService.removeTeamMember(projectId, accountId);
  }

  @Patch(':id/files')
  @ApiOperation({ summary: 'Upload or update project files' })
  @ApiParam({ name: 'id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'technical_file', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  uploadFiles(
    @Param('id') projectId: string,
    @UploadedFiles()
    files: {
      technical_file?: Express.Multer.File[];
      icon?: Express.Multer.File[];
    },
  ) {
    const fileObjects = {
      technical_file: files?.technical_file?.[0],
      icon: files?.icon?.[0],
    };
    return this.projectsService.uploadProjectFiles(projectId, fileObjects);
  }

  @Post('with-files')
  @ApiOperation({ summary: 'Create project with file uploads' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        project_name: { type: 'string', example: 'Website Redesign' },
        customer_name: { type: 'string', example: 'Acme Corporation' },
        description: { type: 'string', example: 'Complete website redesign' },
        start_date: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00Z',
        },
        end_date: {
          type: 'string',
          format: 'date-time',
          example: '2024-06-01T00:00:00Z',
        },
        max_people_front: { type: 'integer', example: 2 },
        max_people_back: { type: 'integer', example: 3 },
        budget: { type: 'number', example: 50000 },
        technical_file: {
          type: 'string',
          format: 'binary',
          description: 'PDF file for technical specifications',
        },
        icon: {
          type: 'string',
          format: 'binary',
          description: 'Image file for project icon',
        },
      },
      required: [
        'project_name',
        'customer_name',
        'start_date',
        'end_date',
        'max_people_front',
        'max_people_back',
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'technical_file', maxCount: 1 },
      { name: 'icon', maxCount: 1 },
    ]),
  )
  createWithFiles(
    @Body() createProjectDto: any,
    @UploadedFiles()
    files: {
      technical_file?: Express.Multer.File[];
      icon?: Express.Multer.File[];
    },
  ) {
    const fileObjects = {
      technical_file: files?.technical_file?.[0],
      icon: files?.icon?.[0],
    };
    return this.projectsService.createWithFiles(createProjectDto, fileObjects);
  }
}
