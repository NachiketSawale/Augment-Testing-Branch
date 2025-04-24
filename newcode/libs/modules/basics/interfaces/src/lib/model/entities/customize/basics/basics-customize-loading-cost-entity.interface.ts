/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLoadingCostEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsFullLoadingCosts: boolean;
	IsReducedLoadingCosts: boolean;
	IsFullLoadingCostsVolume: boolean;
	IsReducedLoadingCostsVolume: boolean;
	IsForPlant: boolean;
	IsForMaterial: boolean;
	IsPercentMaterialTotal: boolean;
}
