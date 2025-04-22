/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the parameter to load Translation Issues
 */
export interface ITranslationIssueParam {
	/**
	 * The item property value
	 */
	itemValue: string;

	/**
	 * The item property name
	 */
	columnName: string;

	/**
	 * BasTranslationFk
	 */
	basTranslationFk: number;

	/**
	 * For extension of the object
	 */
	[key: string]: string|number;
}