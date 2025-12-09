import { Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';

@Controller('admin')
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('listings/pending')
  getPending() {
    return this.adminService.getPendingListings();
  }

  @Post('listings/:id/approve')
  approve(@Param('id') id: string) {
    return this.adminService.approveListing(+id);
  }

  @Post('listings/:id/deny')
  deny(@Param('id') id: string) {
    return this.adminService.denyListing(+id);
  }
}
