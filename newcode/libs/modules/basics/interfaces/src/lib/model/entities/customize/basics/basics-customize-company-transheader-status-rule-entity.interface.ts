/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCompanyTransheaderStatusRuleEntity extends IEntityBase, IEntityIdentification {
	CompanyTransheaderStatusFk: number;
	CompanyTransheaderStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
