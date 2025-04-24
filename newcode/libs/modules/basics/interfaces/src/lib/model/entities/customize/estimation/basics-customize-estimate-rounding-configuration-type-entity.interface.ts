/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstimateRoundingConfigurationTypeEntity extends IEntityBase, IEntityIdentification {
	EstimateRoundingConfigFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
	LineItemContextFk: number;
	IsEnterprise: boolean;
}
