import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.account.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        projectAccounts: {
          include: {
            project: {
              select: {
                id: true,
                project_name: true,
                customer_name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.account.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        projectAccounts: {
          include: {
            project: {
              select: {
                id: true,
                project_name: true,
                customer_name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  // Include password for authentication purposes
  async findByEmail(email: string) {
    return this.prisma.account.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
  }

  async create(data: Prisma.AccountCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.account.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async update(id: string, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }

    return this.prisma.account.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.account.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async getProjects(accountId: string) {
    return this.prisma.projectAccount.findMany({
      where: { account_id: accountId },
      include: {
        project: true,
      },
    });
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
