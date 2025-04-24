/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantWarrantyStatusRuleEntity extends IEntityBase, IEntityIdentification {
	WarrantyStatusFk: number;
	WarrantyStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
