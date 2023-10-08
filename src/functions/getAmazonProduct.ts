/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { Prisma } from "@prisma/client";

const rainforestApiKey = "96D1133B3AB04A3F8C6F62B5AA413029";

type RainforestSearchParams = {
    api_key: string,
    amazon_domain: string,
    type: string,
    search_term: string,
};

export function addAmazonAffiliateTag(url: string): string {
    // Hard code this value
    const affilateTag = `abc`
    return `${url}&tag=${affilateTag}`;
}


const validResult = (obj: any): boolean => {
    if (!obj.position) return false;
    if (!obj.title) return false;
    if (!obj.asin) return false;
    if (!obj.link) return false;
    if (!obj.image) return false;
    if (!obj.rating) return false;
    if (!obj.ratings_total) return false;
    if (!obj.price) return false;
    if (!obj.price.value) return false;
    if (!obj.price.currency) return false;
    return true;
};

const parseApiResult = (rawData: any, websiteName : string): Prisma.ProductCreateManyInput[] => {
    const ret: Prisma.ProductCreateManyInput[] = [];
    for (const data of rawData.search_results) {
        if (!validResult(data)) continue;
        let title = data.title as string 
        if(title.split(" ").length > 10){
            title = title.split(" ").splice(0,10).join(" ")
            title += '...'
        }
        ret.push({
            position: data.position,
            title: title,
            asin: data.asin,
            link: addAmazonAffiliateTag(data.link),
            image: data.image,
            rating: data.rating,
            numRating: data.ratings_total,
            price: data.price.value,
            clicks: 0,
            websiteName: websiteName
        });
        
    }
    return ret;
};
const searchOnAmazon = async (params: RainforestSearchParams): Promise<unknown> => {
    return await axios
        .get("https://api.rainforestapi.com/request", {
            params,
        })
        .then((res) => {
            console.log("Got data successfully -- then");
            return res.data;
        })
        .catch((e) => {
            console.log("Error has occured");
            console.log(e);
        });
};

export const getAmazonProduct = async (
    keywords: string[],
    rootUrl: string,
): Promise<Prisma.ProductCreateManyInput[]> => {
    const query = keywords.join(" ");

    const endpoint = "amazon.com.au";

    // set up the request parameters
    const params = {
        api_key: rainforestApiKey,
        amazon_domain: endpoint,
        type: "search",
        search_term: query,
    };

    const result = await searchOnAmazon(params);
    return parseApiResult(result, rootUrl);
};
