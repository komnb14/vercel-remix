import {json, LoaderArgs} from "@remix-run/node";
import i18next from "~/i18n.server";

import {useLoaderData} from "@remix-run/react";

const DDRAGON_CHAMPION_URL = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/data/ko_KR/champion.json';

export const getUrlHLParams = (url: string) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("hl");
}
export async function loader({request}: LoaderArgs) {
    const testData = await fetch(DDRAGON_CHAMPION_URL);

    return json({testData});
}


import React from 'react'


const GetIndexLoader = () => {
    const {testData} = useLoaderData<typeof loader>()

    return testData;
};

export default GetIndexLoader;
