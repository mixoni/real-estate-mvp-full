import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.listing.findMany({
      where: { status: 'APPROVED' },
      include: { photos: true, agent: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  findOne(id: number) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: { photos: true, agent: { include: { user: true } } },
    });
  }

  // For demo purposes, this just attaches to agent with id=1
  async create(dto: CreateListingDto) {
    return this.prisma.listing.create({
      data: {
        ...dto,
        agentId: 1,
      },
    });
  }
}
