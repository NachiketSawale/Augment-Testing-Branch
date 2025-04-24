/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingComponentStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	DrwCompStatusFk: number;
	DrwCompStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
	Remark: string;
}
