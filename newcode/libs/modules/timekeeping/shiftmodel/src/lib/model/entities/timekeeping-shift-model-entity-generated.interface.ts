// Disabling the module boundaries check is STRICTLY PROHIBITED. You must solve this differently.
// // eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
//import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ITimekeepingShiftModelEntityGenerated extends IEntityBase {
	Id: number;
	TimesheetContextFk: number;
	CalendarFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
	DefaultWorkdayFk?: number | null;
	ShiftGroupFk?: number | null;
}
