import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import {fetch, json, LoaderArgs, MetaFunction} from "@remix-run/node";
import {useChangeLanguage} from "~/hooks/useChangeLanguage";
import i18next from "~/i18n.server";

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


export const loader = async ({request}: LoaderArgs) => {
    const getIndex = await fetch('/api/v1/getIndexLoader');
    const locale = await i18next.getLocale(request);
    const url = request.url;
    return json({locale, url,getIndex});
}

export const meta: MetaFunction = ({data}) => {
    return {
        charset: "utf-8",
        viewport: "width=device-width,initial-scale=1",

    }
};

export default function App() {
    const {i18n, t} = useTranslation();
    let {locale,url,getIndex} = useLoaderData<typeof loader>();



    useChangeLanguage(locale)

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
