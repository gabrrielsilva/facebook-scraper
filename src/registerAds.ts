import { prisma } from './config/prisma';

export async function registerAds(ads: { description: string, linkToProfile: string }[]) {
  await prisma.ad.createMany({
    data: ads.map(ad => {
      return {
        description: ad.description
      }
    })
  })
}