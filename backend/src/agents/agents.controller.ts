import { Controller, Get, Param } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get(':id/listings')
  @Roles(Role.AGENT, Role.ADMIN)
  getListings(@Param('id') id: string) {
    return this.agentsService.getAgentListings(+id);
  }
}
