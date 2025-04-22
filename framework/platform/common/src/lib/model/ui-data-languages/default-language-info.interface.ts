/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Structure of response for getting the default languages info
 */
export interface IDefaultLanguageInfo {
	/**
	 * Default Data Language id
	 */
	DatabaseLanguageId: number;

	/**
	 * Default UI Language id
	 */
	UserLanguageId: number;
}