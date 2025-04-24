/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeModelAnnotationStatusRoleEntity extends IEntityBase, IEntityIdentification {
	AnnoStatusRuleFk: number;
	ClerkRoleFk: number;
}
