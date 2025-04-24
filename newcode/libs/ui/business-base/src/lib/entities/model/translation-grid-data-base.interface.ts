/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The fixed properties of translation grid data
 */
export interface ITranslationGridDataBase {
	/**
	 * Generated row id. i.e. {trValue}-{language id}
	 */
	RowId: string;

	/**
	 * Database Language Id
	 */
	BasLanguageFk: number;

	/**
	 * Language Name
	 */
	Culture: string;

	/**
	 * Id in BasTranslation table
	 */
	Id: number;

	/**
	 * Version
	 */
	Version: number;
}