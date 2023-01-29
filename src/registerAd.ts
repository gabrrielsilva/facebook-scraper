import { prisma } from './config/prisma';

export async function registerAd(description: string) {
  await prisma.ad.create({ data: { description } })
}