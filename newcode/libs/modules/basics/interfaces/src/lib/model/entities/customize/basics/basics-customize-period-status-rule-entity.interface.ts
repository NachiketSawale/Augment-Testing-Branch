/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePeriodStatusRuleEntity extends IEntityBase, IEntityIdentification {
	PeriodStatusFk: number;
	PeriodStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
