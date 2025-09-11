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
}
