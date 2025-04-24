/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingSurchargeTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	EvaluationLevel: number;
	IsStandardRate: boolean;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
