/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialRoundingConfigTypeEntity extends IEntityBase, IEntityIdentification {
	MaterialRoundingConfigFk: number;
	ContextFk: number;
	IsEnterprise: boolean;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
}
