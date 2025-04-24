/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingReportStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	RepStatusFk: number;
	RepStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
