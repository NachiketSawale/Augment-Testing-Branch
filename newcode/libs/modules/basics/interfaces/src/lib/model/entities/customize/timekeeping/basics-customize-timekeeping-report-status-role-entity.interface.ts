/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingReportStatusRoleEntity extends IEntityBase, IEntityIdentification {
	ReportStatusRuleFk: number;
	ClerkRoleFk: number;
}
