/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDispatchStatusRuleEntity extends IEntityBase, IEntityIdentification {
	DispatchStatusFk: number;
	DispatchStatustrgtFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	Hasrolevalidation: boolean;
}
