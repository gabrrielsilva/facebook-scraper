import { prisma } from './config/prisma';

export async function getExistingData() {
  const posts = await prisma.ad.findMany();
  return posts;
}