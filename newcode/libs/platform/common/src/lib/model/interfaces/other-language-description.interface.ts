/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Structure of translation in other language
 */
export interface IOtherLanguageDescription {
	/**
	 * Newly added or modified translation
	 */
	Description: string;

	/**
	 * Data language id
	 */
	LanguageId: number;

	/**
	 * Version of the entity
	 */
	Version: number;
}