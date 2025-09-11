import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  // Get all projects
  async findAll() {
    return this.prisma.project.findMany({
      include: {
        projectAccounts: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  // Get project by ID
  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        projectAccounts: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  // Create new project (regular creation without files)
  async create(data: CreateProjectDto) {
    return this.prisma.project.create({
      data,
      include: {
        projectAccounts: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  // Update project
  async update(id: string, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data,
      include: {
        projectAccounts: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  // Delete project
  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }

  // Add team member to project
  async addTeamMember(projectId: string, accountId: string, role: string) {
    return this.prisma.projectAccount.create({
      data: {
        project_id: projectId,
        account_id: accountId,
        role: role,
      },
      include: {
        account: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  // Remove team member from project
  async removeTeamMember(projectId: string, accountId: string) {
    return this.prisma.projectAccount.delete({
      where: {
        project_id_account_id: {
          project_id: projectId,
          account_id: accountId,
        },
      },
    });
  }

  // Upload files for existing project
  async uploadProjectFiles(
    projectId: string,
    files: { technical_file?: Express.Multer.File; icon?: Express.Multer.File },
  ) {
    const updateData: any = {};

    // Upload technical file (PDF)
    if (files.technical_file) {
      const fileName = `projects/${projectId}/technical_file_${Date.now()}.pdf`;
      const { url } = await this.supabase.uploadFile(
        files.technical_file,
        'project-files',
        fileName,
      );
      updateData.technical_file = url;
    }

    // Upload icon
    if (files.icon) {
      const fileName = `projects/${projectId}/icon_${Date.now()}.${files.icon.originalname.split('.').pop()}`;
      const { url } = await this.supabase.uploadFile(
        files.icon,
        'project-files',
        fileName,
      );
      updateData.icon = url;
    }

    // Update project with file URLs
    return this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        projectAccounts: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  // Create project with files
  async createWithFiles(
    data: CreateProjectDto,
    files: { technical_file?: Express.Multer.File; icon?: Express.Multer.File },
  ) {
    // Transform string values to correct types (multipart/form-data sends everything as strings)
    const transformedData = {
      ...data,
      max_people_front: parseInt(data.max_people_front.toString()),
      max_people_back: parseInt(data.max_people_back.toString()),
      budget: data.budget ? parseFloat(data.budget.toString()) : undefined,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
    };

    // First create the project
    const project = await this.prisma.project.create({
      data: transformedData,
    });

    // Then upload files if provided
    if (files.technical_file || files.icon) {
      return this.uploadProjectFiles(project.id, files);
    }

    // Return project with included relations
    return this.prisma.project.findUnique({
      where: { id: project.id },
      include: {
        projectAccounts: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }
}
