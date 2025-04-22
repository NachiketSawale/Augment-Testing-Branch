/*
 * Copyright(c) RIB Software GmbH
 */

/***
 * Data needed to switch context
 */
export interface ISwitchContextData {
	/***
	 * Requested company id
	 */
	companyId: number;

	/***
	 * Requested permission client id
	 */
	permissionClientId: number;

	/***
	 * Requested role id
	 */
	roleId: number;

	/***
	 * Requested signed in company id
	 */
	signedInCompanyId: number;

	/***
	 * Requested ui language
	 */
	uiLanguage: string;

	/***
	 * Requested culture
	 */
	culture: string;

	/***
	 * Requested data language id
	 */
	dataLanguageId: number
}