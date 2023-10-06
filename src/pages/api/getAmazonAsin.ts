import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient, Prisma } from "@prisma/client";
import { getKeywords } from '~/functions/getKeywords/Chatgpt';
import { getAmazonAsins } from '~/functions/getAmazonAsins';

const prisma = new PrismaClient();

type GetAmazonAsinsRequestData = {
    websiteUrl: string,
    innerTextContent: string | null,
}


const WebsiteInclude = Prisma.validator<Prisma.WebsiteInclude>()({
    products: true,
});
type WebsiteAndProduct = Prisma.WebsiteGetPayload<{
    include: typeof WebsiteInclude;
}>;

const formatResponseMessage = (
    isSuccess: boolean,
    fromCache: boolean,
    message?: string,
    result?: WebsiteAndProduct
) => {
    return {
        body: {
            isSuccess: isSuccess,
            fromCache: fromCache,
            message: message,
            result: result
        }
    };
};


const amazonAsinsToProducts = (amazonAsins: string[], rootUrl: string): Prisma.ProductCreateManyInput[] => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ret = []
    for (const data of amazonAsins) {
        ret.push(
            {
                amazonAsin: data,
                clicks: 0,
                websiteName: rootUrl
            }
        )
    }
    return ret;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send(formatResponseMessage(false, false, "Only POST requests allowed"))
        return
    }
    const data = req.body as GetAmazonAsinsRequestData
    const rootUrl = data.websiteUrl.split('?')[0]

    // request from website only return if there is cached data
    const cacheData = await prisma.website.findUnique({
        where: {
            websiteName: rootUrl,
        },
        include: {
            products: true
        }
    })
    if (cacheData)
        res.status(200).send(formatResponseMessage(true, true, "Results obtained from cache", cacheData))

    // data does not exist in cache, generating with innerHTML
    if (!cacheData && data.innerTextContent) {
        const keywords = await getKeywords(data.innerTextContent)
        if (!keywords) res.status(400).send(formatResponseMessage(false, false, "Generating keywords failed"))
        const amazonAsins = await getAmazonAsins(keywords)
        const createManyInput = amazonAsinsToProducts(amazonAsins, rootUrl!);

        const savedResults = await prisma.website.create({
                data: {
                    websiteName: rootUrl!,
                    searched: 0,
                }
        })

        const product = await prisma.product.createMany({
            data: createManyInput
        })

        const result = await prisma.website.findUnique({
            where: {
                websiteName: rootUrl,
            },
            include: {
                products: true
            }
        })


        res.status(200).send(formatResponseMessage(true, false, "Data retrieved and saved in cachee", result!))
    }

}