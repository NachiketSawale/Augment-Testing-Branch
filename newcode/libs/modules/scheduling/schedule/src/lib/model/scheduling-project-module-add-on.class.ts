/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { SCHEDULING_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingScheduleEntityInfoModel } from './scheduling-schedule-entity-info.model';
import { SchedulingSubScheduleEntityInfo } from './scheduling-subschedule-entity-info.model';
import { SchedulingScheduleKeyDatesEntityInfo } from './schedule-schedule-key-dates-entity-info.model';

@LazyInjectable({
	token: SCHEDULING_PROJECT_MODULE_ADD_ON_TOKEN
})
export class SchedulingProjectModuleAddOn implements IBusinessModuleAddOn {

	public readonly entities = [
		SchedulingScheduleEntityInfoModel,
		SchedulingSubScheduleEntityInfo,
		SchedulingScheduleKeyDatesEntityInfo
	];
}
