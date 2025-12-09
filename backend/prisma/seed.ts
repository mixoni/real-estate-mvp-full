import { PrismaClient, Role, ListingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (for local dev convenience)
  await prisma.inquiry.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('admin123', 10);
  const agentPassword = await bcrypt.hash('agent123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  const agentUser = await prisma.user.create({
    data: {
      email: 'agent@example.com',
      passwordHash: agentPassword,
      role: Role.AGENT,
      emailVerifiedAt: new Date(),
    },
  });

  const agent = await prisma.agent.create({
    data: {
      userId: agentUser.id,
      name: 'John Doe',
      phone: '+1 809 000 000',
      agencyName: 'Caribbean Homes',
    },
  });

  const sampleListings = [
    {
      title: 'Beachfront Condo in Punta Cana',
      description: 'Modern 2-bedroom condo with direct beach access.',
      price: 250000,
      bedrooms: 2,
      bathrooms: 2,
      squareMeters: 95,
      propertyType: 'Condo',
      lat: 18.5601,
      lng: -68.3725,
      address: 'Playa Bavaro',
      city: 'Punta Cana',
    },
    {
      title: 'Villa with Pool in Santo Domingo',
      description: 'Spacious 4-bedroom villa with private pool and garden.',
      price: 480000,
      bedrooms: 4,
      bathrooms: 3,
      squareMeters: 260,
      propertyType: 'House',
      lat: 18.4861,
      lng: -69.9312,
      address: 'Zona Colonial',
      city: 'Santo Domingo',
    },
    {
      title: 'Cozy Apartment in Santiago',
      description: 'Ideal for young professionals, close to city center.',
      price: 120000,
      bedrooms: 1,
      bathrooms: 1,
      squareMeters: 55,
      propertyType: 'Apartment',
      lat: 19.4517,
      lng: -70.6970,
      address: 'Centro',
      city: 'Santiago',
    },
    {
      title: 'Land Plot Near Las Terrenas',
      description: 'Great investment opportunity, 1000m² land near the beach.',
      price: 90000,
      bedrooms: null,
      bathrooms: null,
      squareMeters: 1000,
      propertyType: 'Land',
      lat: 19.3111,
      lng: -69.5401,
      address: 'Los Pescadores',
      city: 'Las Terrenas',
    },
    {
      title: 'Penthouse with Ocean View',
      description: 'Luxury penthouse with panoramic views and rooftop terrace.',
      price: 650000,
      bedrooms: 3,
      bathrooms: 3,
      squareMeters: 180,
      propertyType: 'Penthouse',
      lat: 18.4700,
      lng: -69.9000,
      address: 'Malecon',
      city: 'Santo Domingo',
    }
  ];

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 60);

  for (const data of sampleListings) {
    await prisma.listing.create({
      data: {
        ...data,
        agentId: agent.id,
        status: ListingStatus.APPROVED,
        expiresAt,
      },
    });
  }

  console.log('Seeding finished. Admin: admin@example.com / admin123, Agent: agent@example.com / agent123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
