/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsPhaseRequirementStatusRuleEntity extends IEntityBase, IEntityIdentification {
	PhaseReqStatusFk: number;
	PhaseReqStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
