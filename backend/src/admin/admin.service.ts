import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  getPendingListings() {
    return this.prisma.listing.findMany({
      where: { status: ListingStatus.PENDING },
      include: { agent: { include: { user: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveListing(id: number) {
    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.APPROVED },
    });
  }

  async denyListing(id: number) {
    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.REJECTED },
    });
  }
}
