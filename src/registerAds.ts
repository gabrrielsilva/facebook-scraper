import { prisma } from './config/prisma';

export async function registerAds(ads: { description: string; linkToAd: string }[]) {
  if (ads?.length > 0) {
    await prisma.ad.createMany({
      data: ads.map(ad => {
        return {
          id: ad.description.toLowerCase().replace(/ /g, '').replace(/[^a-z0-9]/gi, '')
        }
      }),
      skipDuplicates: true
    })
  }
}