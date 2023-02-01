import {useTranslation} from "react-i18next";
import {useCallback} from "react";
import {fetch, json, LoaderArgs} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";


export const loader = async ({request}: LoaderArgs) => {
    const classurl = new URL(request.url);
    const getIndex = await fetch(classurl.origin + '/api/v1/getIndexLoader').then((res) => res.json());
    return json({});
}



export default function Index() {
    const {t, i18n} = useTranslation();
    const {} = useLoaderData<typeof loader>()

    const onClickButton = useCallback(() => {
        if (i18n.language === 'ko') {
            i18n.changeLanguage('en');
        } else {
            i18n.changeLanguage('ko');
        }
    }, [i18n.language]);
    return (
        <div>
            <div>{t("greeting")}</div>
            <button onClick={onClickButton}>{t("button")}</button>
        </div>
    );
}
