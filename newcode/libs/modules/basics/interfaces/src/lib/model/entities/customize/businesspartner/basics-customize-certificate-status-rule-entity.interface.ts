/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeCertificateStatusRuleEntity extends IEntityBase, IEntityIdentification {
	AccessrightDescriptorFk: number;
	CertStatusFk: number;
	CertStatusTargetFk: number;
	CommentText: string;
	Hasrolevalidation: boolean;
}
