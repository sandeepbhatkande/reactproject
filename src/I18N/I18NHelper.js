import React from "react";
import { Trans } from 'react-i18next';
import i18n from '../i18n';
import AppHelper from 'js/app/AppHelper';

export const getI18NMessageString = str => {
    const suffix = "_" + AppHelper.getAppData('enterpriseType');
    let i18nText = i18n.t(str + suffix);

    if ( i18nText.endsWith(suffix) ) {
        i18nText = i18n.t(str)
    }

    return i18nText;
};

export const getI18NMessage = str => <Trans>{ getI18NMessageString(str) }</Trans>;

export const changeLanguage = lng => {
    i18n.changeLanguage(lng);
}