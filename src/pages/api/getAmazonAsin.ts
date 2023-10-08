import type { NextApiRequest, NextApiResponse } from 'next'

import { PrismaClient, Prisma } from "@prisma/client";
import { getKeywords } from '~/functions/getKeywords/Chatgpt';
import { getAmazonProduct } from '~/functions/getAmazonProduct';

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
    result?: WebsiteAndProduct | null
) => {
    return {
        isSuccess: isSuccess,
        fromCache: fromCache,
        message: message,
        result: result
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).send(formatResponseMessage(false, false, "Only POST requests allowed"))
        return
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    let data = req.body as GetAmazonAsinsRequestData
    if (typeof req.body === 'string') {
        data = JSON.parse(req.body) as GetAmazonAsinsRequestData
    }
    const rootUrl = data.websiteUrl.split("?")[0]

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
        console.log(cacheData)
    res.status(200).send(formatResponseMessage(true, true, "Results obtained from cache", cacheData))

    // data does not exist in cache, generating with innerHTML
    if (!cacheData && data.innerTextContent) {
        const keywords = await getKeywords(data.innerTextContent)
        if (!keywords) res.status(400).send(formatResponseMessage(false, false, "Generating keywords failed"))
        const amazonProduct = await getAmazonProduct(keywords, rootUrl!)

        console.log(amazonProduct)

        const savedResults = await prisma.website.create({
            data: {
                websiteName: rootUrl!,
                searched: 0,
            }
        })

        const product = await prisma.product.createMany({
            data: amazonProduct
        })

        const result = await prisma.website.findUnique({
            where: {
                websiteName: rootUrl,
            },
            include: {
                products: true
            }
        })


        console.log(result)

        res.status(200).send(formatResponseMessage(true, false, "Data retrieved and saved in cachee", result))
    }

}