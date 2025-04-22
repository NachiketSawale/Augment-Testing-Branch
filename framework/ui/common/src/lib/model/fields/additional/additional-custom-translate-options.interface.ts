/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The options object for a `customtranslate` field.
 *
 * @group Fields API
 */
export interface ICustomTranslateOptions {
	/**
	 * The translation section.
	 */
	section: string;

	/**
	 * The translation ID.
	 */
	id: string;

	/**
	 * The structure name.
	 */
	structure?: string;

	/**
	 * The translation key name.
	 */
	name: string;

	/**
	 * A boolean which indicates, whether the control should watch the control options for changes of the id property.
	 * If true, the control will be initiated again with the new options
	 *
	 */
	watchId?: boolean;

	/**
	 * A boolean which indicates, whether the control should watch the control options for changes of the structure property.
	 * If true, the control will be initiated again with the new options.
	 *
	 */
	watchStructure?: boolean;

	/**
	 * True, if the control should not persist its data directly, but keeps it in the cache, otherwise false
	 */
	cacheEnabled?: boolean;

	/**
	 * Callback function which is executed when controls translation is changed.
	 */
	readonly onTranslationChanged?: (info: ITranslationChangeData) => void;

	/**
	 * Callback function which is executed when the control is fully initialized.
	 */
	readonly onInitiated?: (info: ITranslationInitData) => void;
}

/**
 * An interface that stores additional options for a custom translate control.
 */
export interface IAdditionalCustomTranslateOptions {
	/**
	 * The options for the custom translate field.
	 */
	options: ICustomTranslateOptions;
}

/**
 * Data to be send as argument to call back function on translation initialization.
 */
export interface ITranslationInitData {
	/**
	 * The translation key of the control.
	 */
	translationKey: string;

	/**
	 * The current UI language.
	 */
	language: string;

	/**
	 * The current value of the control.
	 */
	value: string | null;
}

/**
 * Data to be send as argument to call back function on translation update.
 */
export interface ITranslationChangeData extends ITranslationInitData {
	/**
	 * The old value of the control
	 */
	oldValue: string | null;
}
