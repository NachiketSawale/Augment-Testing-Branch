/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IEstShareUrbConfigUrb2CostCode{

	Code: string;

	DescriptionInfo?: IDescriptionInfo | null;

	Description2Info?: IDescriptionInfo | null;

	EstUpp2CostcodeId?: number | null;

	Id: number;

	LineType?: number | null ;

	MdcCostCodeFk?: number | null;

	Project2MdcCstCdeFk?: number | null;

	CostCodeParentFk?: number | null ;

	CostCodes: IEstShareUrbConfigUrb2CostCode[];

	Sort: number;

	UppId?: number | null;
	UppId1?: boolean | null;
	UppId2?: boolean | null;
	UppId3?: boolean | null;
	UppId4?: boolean | null;
	UppId5?: boolean | null;
	UppId6?: boolean | null;
	Version?: number | null;
	image: string;

	EstUppConfigFk?: number | null;

	nodeInfo?: {
		level: number,
		collapsed: boolean,
		lastElement?: boolean,
		children?: boolean|null
	} | null;
}