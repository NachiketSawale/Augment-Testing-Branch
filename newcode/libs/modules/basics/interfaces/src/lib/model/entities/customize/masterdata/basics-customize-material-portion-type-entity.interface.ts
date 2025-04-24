/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialPortionTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	CostCodeFk: number;
	PriceConditionFk: number;
	MasterDataContextFk: number;
	IsEstimatePrice: boolean;
	IsDayworkRate: boolean;
	IsLive: boolean;
	Sorting: number;
	ExternalCode: string;
}
