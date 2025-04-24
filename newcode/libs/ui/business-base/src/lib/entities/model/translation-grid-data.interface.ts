/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslationGridDataBase } from './translation-grid-data-base.interface';

/**
 * The structure of data used in Translation Container
 */
export interface ITranslationGridData extends ITranslationGridDataBase {
	/**
	 * Dynamic translatable column name
	 */
	[key: string]: string | undefined | number;
}