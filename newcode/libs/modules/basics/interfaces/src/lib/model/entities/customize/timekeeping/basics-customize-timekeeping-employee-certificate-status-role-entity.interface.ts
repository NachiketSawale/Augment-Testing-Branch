/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeCertificateStatusRoleEntity extends IEntityBase, IEntityIdentification {
	EmployeeCertificateStatusFk: number;
	EmployeeCertificateStatusTargetFk: number;
	CommentText: string;
	AccessrightDescriptorFk: number;
	HasRoleValidation: boolean;
}
