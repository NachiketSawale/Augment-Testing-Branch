/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringDrawingStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	DrawingStatusFk: number;
	DrawingStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
