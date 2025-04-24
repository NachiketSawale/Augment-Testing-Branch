/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeSubAreaEntity extends IEntityBase, IEntityIdentification {
	TimesheetContextFk: number;
	EmployeeAreaFk: number;
	Description: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
