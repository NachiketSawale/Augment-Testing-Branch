/*
 * Copyright(c) RIB Software GmbH
 */

import { ILanguageData } from '../interfaces/language-data.interface';

/**
 * Provides language data based on culture.
 */
export const platformLanguageData: ILanguageData = {
    'cs-cz': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'da-dk': { numeric: { decimal: ',', thousand: '.' } },
    'de-de': { numeric: { decimal: ',', thousand: '.' } },
    'de-ch': { numeric: { decimal: '.', thousand: '\u2019' } },
    'en-gb': { numeric: { decimal: '.', thousand: ',' } },
    'en-us': { numeric: { decimal: '.', thousand: ',' } },
    'es-es': { numeric: { decimal: ',', thousand: '.' } },
    'fi-fi': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'fr-ch': { numeric: { decimal: '.', thousand: '\u2019' } },
    'fr-fr': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'id-id': { numeric: { decimal: ',', thousand: '.' } },
    'it-it': { numeric: { decimal: ',', thousand: '.' } },
    'it-ch': { numeric: { decimal: '.', thousand: '\u2019' } },
    'ja-jp': { numeric: { decimal: '.', thousand: ',' } },
    'ko-kr': { numeric: { decimal: '.', thousand: ',' } },
    'lt-lt': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'nb-no': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'nl-nl': { numeric: { decimal: ',', thousand: '.' } },
    'pl-pl': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'pt-pt': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'ru-ru': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'sv-se': { numeric: { decimal: ',', thousand: '\u00a0' } },
    'th-th': { numeric: { decimal: '.', thousand: ',' } },
    'vi-vn': { numeric: { decimal: ',', thousand: '.' } },
    'zh-cn': { numeric: { decimal: '.', thousand: ',' } },
    'zh-hant': { numeric: { decimal: '.', thousand: ',' } }
};