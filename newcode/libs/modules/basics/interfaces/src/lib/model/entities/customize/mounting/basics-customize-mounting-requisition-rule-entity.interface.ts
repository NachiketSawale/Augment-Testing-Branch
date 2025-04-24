/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMountingRequisitionRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	ReqStatusFk: number;
	ReqStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
