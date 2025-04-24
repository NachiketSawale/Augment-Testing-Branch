/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsPhaseRequirementStatusRoleEntity extends IEntityBase, IEntityIdentification {
	PhaseReqStatusRuleFk: number;
	ClerkRoleFk: number;
}
