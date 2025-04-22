/*
 * Copyright(c) RIB Software GmbH
 */
import { ICustomTranslateControlInfo } from './custom-translate-control-info.interface';
import { ICustomTranslateControlTranslationData } from './custom-translate-control-translation-data.interface';

/**
 * Registered controls data.
 */
export interface ICustomTranslateControlData {
	/**
	 * The translations of the control.
	 */
	data: ICustomTranslateControlTranslationData;

	/**
	 * The translation key, e.g. '$cust.searchForms.134.987.title'.
	 */
	translationKey: string;

	/**
	 * An easy to extend object with values and functions.
	 */
	info: ICustomTranslateControlInfo;

	/**
	 * Is control changed.
	 */
	isDirty: boolean;
}
