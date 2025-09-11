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
import { AccountsService } from './accounts.service';
import { Prisma } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // GET /accounts
  @Get()
  @ApiOperation({ summary: 'Get all user accounts' })
  findAll() {
    return this.accountsService.findAll();
  }

  // GET /accounts/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.accountsService.findOne(id);
  }

  // GET /accounts/:id/projects
  @Get(':id/projects')
  @ApiOperation({ summary: 'Get projects for a specific account' })
  @ApiParam({ name: 'id' })
  getProjects(@Param('id') id: string) {
    return this.accountsService.getProjects(id);
  }

  // POST /accounts
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ type: CreateAccountDto })
  @Post()
  create(@Body() createAccountDto: Prisma.AccountCreateInput) {
    return this.accountsService.create(createAccountDto);
  }

  // PATCH /accounts/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update an account by ID' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateAccountDto })
  update(@Param('id') id: string, @Body() updateAccountDto: any) {
    return this.accountsService.update(id, updateAccountDto);
  }

  // DELETE /accounts/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }
}
