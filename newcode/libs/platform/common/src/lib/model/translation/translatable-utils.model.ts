/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from './translatable.interface';

interface ITranslationParams {
	key: string;
	params: { [key: string]: number };
}
interface UserDefTranslationGroup extends ITranslationParams {
	identifier: string;
}

/**
 * Adds a given prefix to all translation keys in a given translatable map.
 * @param prefix The prefix.
 * @param translatableMap The translatable map.
 * @returns The enriched translatable map.
 */
export function prefixAllTranslationKeys(prefix: string, translatableMap: {
	[key: string]: Translatable;
}): {
	[key: string]: Translatable;
} {
	const result = {
		...translatableMap
	};

	for (const key in result) {
		const val = result[key];
		if (typeof val === 'string') {
			result[key] = prefix + val;
		} else if (typeof val === 'object') {
			if (val.key) {
				val.key = prefix + val.key;
			}
		}
	}

	return result;
}

export function addUserDefinedTextTranslation(
	words: { [key: string]: ITranslationParams },
	count: number,
	preFix: string = 'UserDefinedText',
	interFix: string = '',
	userGroup: string = 'userDefTextGroup'
) {
	const result = { ...words };
	result[userGroup] = { identifier: 'UserdefTexts' } as UserDefTranslationGroup;

	for (let j = 1; j <= count; ++j) {
		const createdName = j !== 10 ? `${preFix}${interFix}0${j}` : `${preFix}${interFix}${j}`;
		result[createdName] = {
			key:'cloud.common.entityUserDefText',
			params: { 'p_0': j }
		};

		if (j === 9) {
			interFix = '';
		}
	}
	return result;
}


export function addUserDefinedNumberTranslation(
	words: { [key: string]: ITranslationParams },
	count: number,
	preFix: string = 'UserDefinedNumber',
	interFix: string = '',
	userGroup: string = 'userDefNumberGroup'
) {
	const result = { ...words };
	result[userGroup] = { identifier: 'UserdefNumbers' } as UserDefTranslationGroup;

	for (let j = 1; j <= count; ++j) {
		const createdName = j !== 10 ? `${preFix}${interFix}0${j}` : `${preFix}${interFix}${j}`;
		result[createdName] = {
			key:'cloud.common.entityUserDefNumber',
			params: { 'p_0': j }
		};

		if (j === 9) {
			interFix = '';
		}
	}
	return result;
}

export function addUserDefinedDateTranslation(
	words: { [key: string]: ITranslationParams },
	count: number,
	preFix: string = 'UserDefinedDate',
	interFix: string = '',
	userGroup: string = 'userDefDateGroup'
) {
	const result = { ...words };
	result[userGroup] = { identifier: 'UserdefDates' } as UserDefTranslationGroup;

	for (let j = 1; j <= count; ++j) {
		const createdName = j !== 10 ? `${preFix}${interFix}0${j}` : `${preFix}${interFix}${j}`;
		result[createdName] = {
			key:'cloud.common.entityUserDefDate',
			params: { 'p_0': j }
		};
		if (j === 9) {
			interFix = '';
		}
	}
	return result;
}


