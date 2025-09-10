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
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  //get project by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  // post projects
  @Post()
  create(@Body() createProjectDto: any) {
    return this.projectsService.create(createProjectDto);
  }
  // patch projects/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: any) {
    return this.projectsService.update(id, updateProjectDto);
  }

  // delete project by id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  // POST /projects/:id/team
  //adds person to project team
  @Post(':id/team')
  addTeamMember(
    @Param('id') projectId: string,
    @Body() body: { accountId: string; role: string },
  ) {
    return this.projectsService.addTeamMember(
      projectId,
      body.accountId,
      body.role,
    );
  }

  // DELETE /projects/:id/team/:accountId
  //removes person from project team
  @Delete(':id/team/:accountId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTeamMember(
    @Param('id') projectId: string,
    @Param('accountId') accountId: string,
  ) {
    return this.projectsService.removeTeamMember(projectId, accountId);
  }
}
