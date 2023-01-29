import { prisma } from './config/prisma';

export async function getExistingData() {
  const posts = await prisma.ad.findMany({
    select: {
      id: false,
      description: true
    }
  });
  return posts;
}