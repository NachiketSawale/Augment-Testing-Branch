/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTimekeepingEmployeeAreaEntity extends IEntityBase, IEntityIdentification {
	TimesheetContextFk: number;
	Description: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
