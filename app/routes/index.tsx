import {useTranslation} from "react-i18next";
import {useCallback} from "react";


export default function Index() {
  const {t, i18n} = useTranslation();



  const onClickButton = useCallback(() => {
    if(i18n.language === 'ko') {
      i18n.changeLanguage('en');
    } else {
      i18n.changeLanguage('ko');
    }
  },[i18n.language]);

  return (
      <div>
        <div>{t("greeting")}</div>
        <button onClick={onClickButton}>{t("button")}</button>
      </div>
  );
}
