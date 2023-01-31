import {RemixBrowser} from "@remix-run/react";
import {startTransition, StrictMode} from "react";
import {hydrateRoot} from "react-dom/client";
import i18next from "i18next";
import {I18nextProvider, initReactI18next} from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-fs-backend";
import i18n from "~/i18n";
import {getInitialNamespaces} from "remix-i18next";
import commonKo from "../public/locales/ko/common.json";
import commonEn from '../public/locales/en/common.json';
async function hydrate() {
  await i18next
      .use(initReactI18next) // Tell i18next to use the react-i18next plugin
      .use(I18nextBrowserLanguageDetector) // Setup a client-side language detector
      .use(Backend) // Setup your backend
      .init({
        debug:false,
        ...i18n, // spread the configuration
        // This function detects the namespaces your routes rendered while SSR use
        ns: getInitialNamespaces(),
        resources: {
          ko: {
            common: commonKo,
          },
          en: {
            common: commonEn,
          }
        },
        detection: {
          order: ["htmlTag"],
          caches: [],
        },
      });


  startTransition(() => {
    hydrateRoot(
        document,
        <I18nextProvider i18n={i18next}>
          <StrictMode>
            <RemixBrowser/>
          </StrictMode>
        </I18nextProvider>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
