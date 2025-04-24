/*
 * Copyright(c) RIB Software GmbH
 */
import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingSharedModuleInfo } from './lib/model/scheduling-shared-module-info.class';

export * from './lib/scheduling-shared.module';
export * from './lib/services/lookup/index';
export * from './lib/services/lookup/scheduling-project-execution-schedule-lookup.service';
export * from './lib/services/lookup/scheduling-templategroup-tree-lookup.service';
export * from  './lib/model/interfaces/scheduling-templategroup-tree.interface';

export * from './lib/services/lookup/scheduling-baseline-lookup.service';
export * from './lib/services/lookup/scheduling-baseline-specification-lookup.service';
export * from './lib/services/lookup/scheduling-schedule-lookup.service';
export * from './lib/services/lookup/scheduling-baseline-byschedule-lookup.service';
export * from './lib/services/lookup/scheduling-progress-report-lineitem-header-lookup.service';
export * from './lib/services/common-week-day-data.service';
export * from './lib/services/common-work-hour-data.service';
export * from './lib/model/interfaces/scheduling-main-request-entity.interface';

export * from './lib/services/lookup/scheduling-main-event-lookup.service';

export * from './lib/services/lookup/scheduling-activity-full-lookup.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return SchedulingSharedModuleInfo.instance;
}