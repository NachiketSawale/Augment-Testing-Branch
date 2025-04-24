/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstimateAllowanceEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	MasterContextFk: number;
	AllowanceTypeFk: number;
	MarkupCalcTypeFk: number;
	IsOneStep: boolean;
	IsBalanceFP: boolean;
	QuantityTypeFk: number;
	MarkupGa: number;
	MarkupRp: number;
	MarkupAm: number;
	MarkupGaSc: number;
	MarkupRpSc: number;
	MarkupAmSc: number;
	IsDefault: boolean;
	IsLive: boolean;
	AllAreaGroupTypeFk: number;
}
