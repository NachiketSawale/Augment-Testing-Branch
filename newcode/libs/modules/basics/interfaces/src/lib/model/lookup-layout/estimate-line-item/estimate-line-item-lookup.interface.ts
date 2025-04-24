/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

/**
 *  IEstimateMainLineItemLookupDialogEntity is the interface use for line item quantity maintenance wizard dialog
 */

export interface IEstimateMainLineItemLookupDialogEntity {
	/**
	 * Code
	 */
	Code: string;

	/**
	 * Description
	 */
	DescriptionInfo: IDescriptionInfo;

	/**
	 * BoqItemRefNo
	 */
	BoqItemFk: number;

	/**
	 * BoqItemRefNoBriefNo
	 */
	BoqHeaderFk: number;
}
