/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeClerkRole2EntityPropEntity extends IEntityBase, IEntityIdentification {
	ModuleFk: number;
	Entity: number;
	Attribute: number;
	ClerkRoleFk: number;
	CommentText: string;
}
