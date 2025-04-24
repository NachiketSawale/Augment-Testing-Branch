/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstAllowanceConfigTypeEntity extends IEntityBase, IEntityIdentification {
	AllowanceConfigFk: number;
	MasterdataContextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
}
