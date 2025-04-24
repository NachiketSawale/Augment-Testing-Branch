/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBillIndirectCostBalancingConfigurationEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
	IndirectCostBalancingConfigurationDetailFk: number;
}
