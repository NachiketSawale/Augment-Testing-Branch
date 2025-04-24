/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBoqRoundingConfigurationTypeEntity extends IEntityBase, IEntityIdentification {
	BoqRoundingConfigFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
	LineItemContextFk: number;
	IsEnterprise: boolean;
}
