/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEvaluationStatusRoleEntity extends IEntityBase, IEntityIdentification {
	EvalstatusruleFk: number;
	ClerkRoleFk: number;
}
