/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IEstShareUrbConfigCostCode{
	Id: number;

	Code: string;

	LineType?: number | null;

	MdcCostCodeFk?: number | null;

	Project2MdcCstCdeFk?: number | null;

	CostCodes: IEstShareUrbConfigCostCode[];

	CostCodeParentFk?: number | null;

	Description2Info?: IDescriptionInfo | null;

	DescriptionInfo?: IDescriptionInfo | null;

	ParentMdcCostCodeFk?: number | null;

	IsOnlyProjectCostCode?: boolean | null;

	Sort?: number | null;

	Version?: number;
}