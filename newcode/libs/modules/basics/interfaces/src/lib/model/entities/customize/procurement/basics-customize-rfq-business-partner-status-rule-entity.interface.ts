/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRfqBusinessPartnerStatusRuleEntity extends IEntityBase, IEntityIdentification {
	BusinessPartnerStatusFk: number;
	BusinessPartnerStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
