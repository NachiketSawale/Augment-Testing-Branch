/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IStatusIcon } from './status-icon.interface';

/**
 * Accordion options
 */
export interface IStatus extends IStatusIcon {
	/**
	 * Status id
	 */
	Id: number;
	/**
	 * Status description
	 */
	DescriptionInfo?: IDescriptionInfo;
	/**
	 * Status sorting number
	 */
	Sorting: number;
	/**
	 * Status icon background color
	 */
	BackGroundColor?: number;
	/**
	 * Status icon font color
	 */
	FontColor?: number;
	/**
	 * Status is available or not
	 */
	isAvailable?: boolean;
	/**
	 * Status optional upwards
	 */
	IsOptionalUpwards?: boolean;
	/**
	 * Status optional downwards
	 */
	IsOptionalDownwards?: boolean;
	/**
	 * Status rubric category
	 */
	RubricCategoryFk?: number;
	/**
	 * Status is default
	 */
	IsDefault?: boolean;
}
