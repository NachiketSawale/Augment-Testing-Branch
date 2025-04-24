/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeModelAnnotationStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AnnoStatusFk: number;
	AnnoStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
