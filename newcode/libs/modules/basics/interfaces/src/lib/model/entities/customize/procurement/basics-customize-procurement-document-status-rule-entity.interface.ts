/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementDocumentStatusRuleEntity extends IEntityBase, IEntityIdentification {
	DocumentStatusFk: number;
	CommentText: string;
	HasRoleValidation: boolean;
	DocumentStatusTargetFk: number;
	AccessrightDescriptorFk: number;
}
