import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import {useTranslation} from "react-i18next";
import {json, LoaderArgs, MetaFunction} from "@remix-run/node";
import i18next from "~/i18n.server";
import {withSentry} from "@sentry/remix";

// @ts-ignore
export const links: LinksFunction = () => {
    return [
        {rel: "alternate", hrefLang: 'en', href: `https://vercel-remix-red.vercel.app/?hl=en`},
        {rel: "alternate", hrefLang: 'ko', href: `https://vercel-remix-red.vercel.app/?hl=ko`},
        {rel: "alternate", hrefLang: 'x-default', href: `https://vercel-remix-red.vercel.app/`},
    ];
};

export const handle = {
    i18n: "common",
}


export const loader = async ({request}: LoaderArgs) => {
    const locale = await i18next.getLocale(request);
    const url = request.url;
    return json({locale, url});
}

export const meta: MetaFunction = ({data}) => {
    return {
        charset: "utf-8",
        viewport: "width=device-width,initial-scale=1",

    }
};

function App() {
    const {i18n, t} = useTranslation();
    let {locale, url} = useLoaderData<typeof loader>();

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
export default withSentry(App);
