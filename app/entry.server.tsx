import {RemixServer} from "@remix-run/react";
import {renderToString} from "react-dom/server";
import {createInstance} from "i18next";
import i18next from "~/i18n.server";
import {I18nextProvider, initReactI18next} from "react-i18next";
import Backend from "i18next-fs-backend";
import i18n from "~/i18n"
import commonKo from '../public/locales/ko/common.json';
import commonEn from '../public/locales/en/common.json';
import {EntryContext} from "@remix-run/node";
import {getUrlHLParams} from "~/routes/api/v1/getIndexLoader";
import * as Sentry from "@sentry/remix";
import {Integrations} from "@sentry/remix";

Sentry.init({
    dsn: "https://a6210568ac364c16af778057246f2a83:c16d13d6ba4343d7bf013dbc7159ae42@o4504605087956992.ingest.sentry.io/4504605097852928",
    tracesSampleRate: 1,
    integrations: [new Sentry.Integrations.BrowserTracing()],
});

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
