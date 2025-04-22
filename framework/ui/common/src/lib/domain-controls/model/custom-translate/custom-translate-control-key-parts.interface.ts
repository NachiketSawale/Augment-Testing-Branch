/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * 'cloud/translation/custom/gettranslationkeyparts' endpoint server response.
 */
export interface ICustomTranslateControlKeyParts {
	/**
	 * Full key
	 */
	readonly fullName: string;

	/**
	 * Id of key.
	 */
	readonly id: string;

	/**
	 * Key name.
	 */
	readonly name: string;

	/**
	 * Keys parts.
	 */
	readonly partsArray: string[];

	/**
	 * Key prefix.
	 */
	readonly prefix: string;

	/**
	 * Key Section.
	 */
	readonly section: string;

	/**
	 * Key structure.
	 */
	readonly structure: string;

	/**
	 * Key Token.
	 */
	readonly token: string;
}
