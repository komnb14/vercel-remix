import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import {json} from "@remix-run/router";
import {useTranslation} from "react-i18next";
import {LoaderArgs, MetaFunction} from "@remix-run/node";

const DDRAGON_CHAMPION_URL = 'https://ddragon.leagueoflegends.com/cdn/13.1.1/data/ko_KR/champion.json';

// @ts-ignore
export const links: LinksFunction = () => {
    return [
        {rel: "alternate", hrefLang: 'en', href: `https://robot-testing.pages.dev/?hl=en`},
        {rel: "alternate", hrefLang: 'ko', href: `https://robot-testing.pagbes.dev/?hl=ko`},
        {rel: "alternate", hrefLang: 'x-default', href: `https://robot-testing.pages.dev`},
    ];
};

export const handle = {
    i18n: "common",
}

export const getUrlHLParams = (url: string) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("hl");

}

export async function loader({request}: LoaderArgs) {
    const testData = await fetch(DDRAGON_CHAMPION_URL);
    const url = request.url;
    console.log("THIS NOT SHOULD CALLED");
    return json({url, testData}, {
        status: 200,
        headers: {
            "content-type": "application/json",
            "Cache-Control": "public, maxage=600, s-maxage=6000",
        }
    });
}


export const headers = ({loaderHeaders}: { loaderHeaders: Headers }) => {

    return {
        "Cache-Control": loaderHeaders.get('Cache-Control'),
    }
}

export const meta: MetaFunction = ({data}) => {
    return {
        charset: "utf-8",
        viewport: "width=device-width,initial-scale=1",

    }
};

export default function App() {
    const {i18n, t} = useTranslation();
    let {url,} = useLoaderData<typeof loader>();


    return (
        <html lang={i18n.language}>
        <head>
            <title>{t("header")}</title>
            <meta httpEquiv="content-language" content={i18n.language}/>
            <Meta/>
            <link rel={'canonical'} href={`${url}`}/>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
