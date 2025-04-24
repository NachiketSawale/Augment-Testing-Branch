/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsGenericEventStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	GenericEventStatusFk: number;
	GenericEventStatusTargetFk: number;
	CommentText: string;
	HasRoleValidation: boolean;
}
