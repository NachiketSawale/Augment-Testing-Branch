/*
 * Copyright(c) RIB Software GmbH
 */

import { DataTranslationEntity } from './data-translation-entity.model';
import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Structure of data encapsulating DescriptionInfo and the corresponding translations
 */
export interface IDataTranslations {
	/**
	 * Translated column name
	 */
	columnName: string;

	/**
	 * The ID in BasTranslation table/ the tr value of the column
	 */
	trValue: number;

	/**
	 * BasTranslation entries
	 */
	translations: DataTranslationEntity[],

	/**
	 * The DescriptionInfo object
	 */
	descriptionInfoObj: IDescriptionInfo
}