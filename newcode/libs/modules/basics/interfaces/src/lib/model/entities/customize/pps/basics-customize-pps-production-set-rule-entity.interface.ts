/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductionSetRuleEntity extends IEntityBase, IEntityIdentification {
	ProductionSetStatusFk: number;
	ProductionSetStatusTargetFk: number;
	AccessrightDescriptorFk: number;
	CommentText: string;
	HasRoleValidation: boolean;
}
