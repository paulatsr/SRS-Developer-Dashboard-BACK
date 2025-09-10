import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

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

  //Get project by id
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

  //crate a new project
  async create(data: any) {
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

  //update a project
  //TODO: create dto instead of any
  async update(id: string, data: any) {
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
}
