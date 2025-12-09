import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAgentListings(agentId: number) {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.prisma.listing.findMany({
      where: { agentId },
      include: { photos: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
