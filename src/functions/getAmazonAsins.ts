/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

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


const parseApiResult = (rawData: any): any[] => {
    const ret: any[] = [];
    for (const data of rawData.search_results) {
        if (!data.asin) continue;
        ret.push({
            asin: data.asin,
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
            console.log({
                results: res.data,
            });
            return res.data;
        })
        .catch((e) => {
            console.log("Error has occured");
            console.log(e);
        });
};

export const getAmazonAsins = async (
    keywords: string[],
): Promise<string[]> => {
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
    return parseApiResult(result);
};
