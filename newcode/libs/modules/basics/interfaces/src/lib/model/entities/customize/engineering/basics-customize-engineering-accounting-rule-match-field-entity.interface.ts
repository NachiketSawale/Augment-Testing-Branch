/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringAccountingRuleMatchFieldEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	AccImportFormatFk: number;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
}
