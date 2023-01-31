import {RemixServer} from "@remix-run/react";
import {renderToString} from "react-dom/server";
import {createInstance} from "i18next";
import i18next from "~/i18n.server";
import {I18nextProvider, initReactI18next} from "react-i18next";
import Backend from "i18next-fs-backend";
import i18n from "~/i18n"
import commonKo from '../public/locales/ko/common.json';
import commonEn from '../public/locales/en/common.json';
import {getUrlHLParams} from "~/root";
import {EntryContext} from "@remix-run/node";

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
) {
    let instance = createInstance();
    let lng = await i18next.getLocale(request);
    let ns = i18next.getRouteNamespaces(remixContext);

    const hlang = getUrlHLParams(request.url);
    if (hlang) {
        lng = hlang;
    }


    await instance
        .use(initReactI18next) // Tell our instance to use react-i18next
        .use(Backend) // Setup our backend
        .init({
            debug: false,
            ...i18n, // spread the configuration
            lng, // The locale we detected above
            ns, // The namespaces the routes about to render wants to use
            fallbackLng: lng,
            resources: {
                ko: {
                    common: commonKo,
                },
                en: {
                    common: commonEn,
                }
            }
        });


    const markup = renderToString(
        <I18nextProvider i18n={instance}>
            <RemixServer context={remixContext} url={request.url}/>
        </I18nextProvider>
    );

    responseHeaders.set("Content-Type", "text/html");


    return new Response("<!DOCTYPE html>" + markup, {
        status: responseStatusCode,
        headers: responseHeaders,
    });
}
