/*
 * Copyright(c) RIB Software GmbH
 */

import { IOtherLanguageDescription } from './other-language-description.interface';

export interface IDescriptionInfo {

	/**
	 * Description of the item
	 */
	Description : string;

	/**
	 * Version of the description
	 */
	DescriptionTr : number;

	/**
	 * Flag to indicate if the description has been modified
	 */
	DescriptionModified : boolean;

	/**
	 * Translated description of the item
	 */
	Translated : string;

	/**
	 * Version of the translated description
	 */
	VersionTr : number;

	/**
	 * Flag to indicate if the translated description has been modified
	 */
	Modified : boolean;

	/**
	 * Other languages
	 */
	OtherLanguages : IOtherLanguageDescription[] | null;
}