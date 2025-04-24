/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSpecificValueTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	UomFk: number;
	IsDefault: boolean;
	IsCostCode: boolean;
	IsPerformance: boolean;
	IsEmmission: boolean;
	Sorting: number;
	IsLive: boolean;
	IsCatalogEstimate: boolean;
	IsFixedCost: boolean;
	Code: string;
}
