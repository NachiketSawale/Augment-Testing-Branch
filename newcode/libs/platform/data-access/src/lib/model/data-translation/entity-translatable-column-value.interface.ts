/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';


/**
 * Structure of data encapsulating column name and corresponding DescriptionInfo object
 */
export interface IEntityTranslatableColumnValue {
	/**
	 * The translated column name
	 */
	columnName: string;

	/**
	 * Corresponding DescriptionInfo
	 */
	columnValue: IDescriptionInfo
}