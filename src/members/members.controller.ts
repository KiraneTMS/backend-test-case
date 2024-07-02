import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  async findAll(): Promise<Member[]> {
    return this.membersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Member> {
    return this.membersService.findOne(id);
  }

  @Post()
  async create(@Body() member: Partial<Member>): Promise<Member> {
    return this.membersService.create(member);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() member: Partial<Member>,
  ): Promise<Member> {
    return this.membersService.update(id, member);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.membersService.remove(id);
  }
}
