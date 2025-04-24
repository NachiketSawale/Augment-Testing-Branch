/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeObjectInstallmentAgreementStatusRuleEntity extends IEntityBase, IEntityIdentification {
	InstallmentAgreementStateFk: number;
	InstallmentAgreementStateTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
