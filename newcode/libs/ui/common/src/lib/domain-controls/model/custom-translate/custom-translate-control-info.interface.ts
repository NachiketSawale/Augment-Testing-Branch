/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Change/update control.
 */
type ICustomTranslateControlChange = {
	/**
	 * Sets value to the control.
	 */
	readonly setValue: (value: string, info?: ICustomTranslateControlInfo) => void;

	/**
	 * Updates control value.
	 */
	readonly updateValue: (info?: ICustomTranslateControlInfo) => void;
};

export interface ICustomTranslateControlInfo {
	/**
	 * True, if the control should not persist its data directly, but keeps it in the cache, otherwise false
	 */
	readonly cacheEnabled: boolean;

	/**
	 * Property to change/update control.
	 */
	readonly changeValue: ICustomTranslateControlChange;
}
