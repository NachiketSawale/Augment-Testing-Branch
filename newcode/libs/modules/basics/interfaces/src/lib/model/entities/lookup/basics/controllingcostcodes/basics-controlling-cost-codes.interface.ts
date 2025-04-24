/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

//
export interface IControllingCostCodes {
	/*
	 * Id;
	 */
	Id: number;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo: IDescriptionInfo;

	/*
	 * ContrCostCodeParentFk
	 */
	ContrCostCodeParentFk?: number | null;

	/*
	 * UomFk
	 */
	UomFk?: number | null;

	/*
	 * MdcContextFk
	 */
	MdcContextFk?: number | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * IsRevenue
	 */
	IsRevenue?: boolean | null;

	/*
	 * IsCostPrr
	 */
	IsCostPrr?: boolean | null;

	/*
	 * IsRevenuePrr
	 */
	IsRevenuePrr?: boolean | null;

	/*
	 * RevenueInt
	 */
	RevenueInt?: number | null;

	/*
	 * ContrCostCodeChildrens
	 */
	ContrCostCodeChildrens: [];
}
