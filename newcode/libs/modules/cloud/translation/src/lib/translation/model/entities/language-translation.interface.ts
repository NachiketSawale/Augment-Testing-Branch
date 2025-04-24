/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, Translatable } from '@libs/platform/common';

/**
 *  Language Translation Entity Lookup
 */
export interface ILanguageTranslation extends IEntityBase {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * Description
	 */
	Description: Translatable ;

	/**
	 * Sorting
	 */
	Sorting: number;

	/**
	 * IsDefault
	 */
	IsDefault: boolean;

	/**
	 * Culture
	 */
	Culture: Translatable ;
	/**
	 * LanguageId
	 */
	LanguageId: number;

	/**
	 * IsSystem
	 */
	IsSystem: boolean;

	/**
	 * ExportColumnName
	 */
	ExportColumnName: Translatable ;

	/**
	 * IsLive
	 */
	IsLive: boolean;

	/**
	 * AccessGuid
	 */
	AccessGuid: Translatable ;
}
