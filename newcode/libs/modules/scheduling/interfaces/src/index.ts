/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingInterfacesModuleInfo } from './lib/model/scheduling-interfaces-module-info.class';

export * from './lib/scheduling-interfaces.module';

export * from '../src/lib/model/entities/schedule-entity.interface';
export * from '../src/lib/model/entities/scheduling-action-entity.interface';
export * from '../src/lib/model/entities/location-info-entity.interface';
export * from '../src/lib/model/entities/baseline-entity.interface';
export * from '../src/lib/model/entities/activity-entity.interface';
export * from '../src/lib/model/entities/activity-type-entity.interface';
export * from '../src/lib/model/entities/hammock-activity-entity.interface';
export * from '../src/lib/model/entities/activity-progress-report-entity.interface';
export * from '../src/lib/model/entities/line-item-header-entity.interface';
export * from '../src/lib/model/entities/line-item-entity.interface';
export * from '../src/lib/model/entities/activity-comment-entity.interface';
export * from '../src/lib/model/entities/calculation-activity-entity.interface';
export * from '../src/lib/model/entities/activity-clerk-entity.interface';
export * from '../src/lib/model/entities/event-entity.interface';
export * from '../src/lib/model/entities/line-item-progress-entity.interface';
export * from '../src/lib/model/entities/activity-observation-entity.interface';
export * from '../src/lib/model/entities/activity-relationship-entity.interface';
export * from '../src/lib/model/entities/activity-2model-object-entity.interface';
export * from '../src/lib/model/entities/activity-split-entity.interface';
export * from '../src/lib/model/entities/printing-entity.interface';
export * from '../src/lib/model/entities/activity-creation-data.interface';
export * from '../src/lib/model/entities/create-progress-report-entity.interface';
export * from '../src/lib/model/entities/change-activity-state-entity.interface';
export * from '../src/lib/model/entities/activity-baseline-cmp-ventity.interface';
export * from '../src/lib/model/entities/belongs-to-activity-est-line-item-entity-cpl-to-save-dto.interface';

export * from  '../src/lib/model/entities/renumber-data-entity.interface';
export * from  '../src/lib/model/entities/prc-package-entity.interface';
export * from  '../src/lib/model/entities/performance-sheet-entity.interface';
export * from  '../src/lib/model/entities/assign-cudata-entity.interface';
export * from  '../src/lib/model/entities/reschedule-uncomplete-tasks.interface';
export * from  '../src/lib/model/entities/generate-activities-via-criteria-entity.interface';
export * from  '../src/lib/model/entities/update-planned-duration-entity.interface';
export * from  '../src/lib/model/entities/sort-data-entity.interface';
export * from  '../src/lib/model/entities/criteria-1entity.interface';
export * from  '../src/lib/model/entities/refresh-hammock-date-field-request-entity.interface';
export * from  '../src/lib/model/entities/activity-is-unique-entity.interface';
export * from  '../src/lib/model/entities/project-search-value.interface';
export * from  '../src/lib/model/entities/schedule-extended-entity.interface';
export * from  '../src/lib/model/entities/small-activity-entity.interface';
export * from  '../src/lib/model/entities/filter-entity.interface';
export * from  '../src/lib/model/entities/import-request-entity.interface';
export * from  '../src/lib/model/entities/import-result-entity.interface';
export * from  '../src/lib/model/entities/requisition-entity.interface';
export * from  '../src/lib/model/entities/activity-identifier.interface';
export * from  '../src/lib/model/entities/activity-progress-report-is-unique-entity.interface';
export * from  '../src/lib/model/entities/relationship-creation-params.interface';
export * from  '../src/lib/model/entities/relationships-creation-params.interface';
export * from  '../src/lib/model/entities/settings-entity.interface';
export * from  '../src/lib/model/entities/split-ids.interface';
export * from  '../src/lib/model/entities/simulated-gantt-request-entity.interface';
export * from  '../src/lib/model/entities/simulated-gantt-data-entity.interface';
export * from  '../src/lib/model/entities/simulated-gantt-activity-entity.interface';
export * from  '../src/lib/model/entities/activity-model-object-request-entity.interface';
export * from  '../src/lib/model/entities/model-timeline-request-entity.interface';
export * from  '../src/lib/model/entities/calculate-activity-2model-object-entity.interface';
export * from  '../src/lib/model/entities/filter.interface';
export * from  '../src/lib/model/entities/activity-baseline-cmp-ventity-generated.interface';
export * from  '../src/lib/model/entities/activity-observation-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-entity-generated.interface';
export * from  '../src/lib/model/entities/baseline-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-type-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-clerk-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-progress-report-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-relationship-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-comment-entity-generated.interface';
export * from  '../src/lib/model/entities/hammock-activity-entity-generated.interface';
export * from  '../src/lib/model/entities/line-item-entity-generated.interface';
export * from  '../src/lib/model/entities/line-item-header-entity-generated.interface';
export * from  '../src/lib/model/entities/printing-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-creation-data-generated.interface';
export * from  '../src/lib/model/entities/calculation-activity-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-split-entity-generated.interface';
export * from  '../src/lib/model/entities/event-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-2model-object-entity-generated.interface';
export * from  '../src/lib/model/entities/belongs-to-activity-est-line-item-entity-cpl-to-save-dto-generated.interface';
export * from  '../src/lib/model/entities/scheduling-action-entity-generated.interface';
export * from  '../src/lib/model/entities/line-item-progress-entity-generated.interface';
export * from  '../src/lib/model/entities/location-info-entity-generated.interface';
export * from  '../src/lib/model/entities/create-progress-report-entity-generated.interface';
export * from  '../src/lib/model/entities/change-activity-state-entity-generated.interface';
export * from  '../src/lib/model/entities/renumber-data-entity-generated.interface';
export * from  '../src/lib/model/entities/prc-package-entity-generated.interface';
export * from  '../src/lib/model/entities/performance-sheet-entity-generated.interface';
export * from  '../src/lib/model/entities/assign-cudata-entity-generated.interface';
export * from  '../src/lib/model/entities/reschedule-uncomplete-tasks-generated.interface';
export * from  '../src/lib/model/entities/generate-activities-via-criteria-entity-generated.interface';
export * from  '../src/lib/model/entities/update-planned-duration-entity-generated.interface';
export * from  '../src/lib/model/entities/sort-data-entity-generated.interface';
export * from  '../src/lib/model/entities/criteria-1entity-generated.interface';
export * from  '../src/lib/model/entities/refresh-hammock-date-field-request-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-is-unique-entity-generated.interface';
export * from  '../src/lib/model/entities/project-search-value-generated.interface';
export * from  '../src/lib/model/entities/schedule-extended-entity-generated.interface';
export * from  '../src/lib/model/entities/small-activity-entity-generated.interface';
export * from  '../src/lib/model/entities/filter-entity-generated.interface';
export * from  '../src/lib/model/entities/import-request-entity-generated.interface';
export * from  '../src/lib/model/entities/import-result-entity-generated.interface';
export * from  '../src/lib/model/entities/requisition-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-identifier-generated.interface';
export * from  '../src/lib/model/entities/activity-progress-report-is-unique-entity-generated.interface';
export * from  '../src/lib/model/entities/relationship-creation-params-generated.interface';
export * from  '../src/lib/model/entities/relationships-creation-params-generated.interface';
export * from  '../src/lib/model/entities/settings-entity-generated.interface';
export * from  '../src/lib/model/entities/split-ids-generated.interface';
export * from  '../src/lib/model/entities/simulated-gantt-request-entity-generated.interface';
export * from  '../src/lib/model/entities/simulated-gantt-data-entity-generated.interface';
export * from  '../src/lib/model/entities/simulated-gantt-activity-entity-generated.interface';
export * from  '../src/lib/model/entities/activity-model-object-request-entity-generated.interface';
export * from  '../src/lib/model/entities/model-timeline-request-entity-generated.interface';
export * from  '../src/lib/model/entities/calculate-activity-2model-object-entity-generated.interface';
export * from  '../src/lib/model/entities/filter-generated.interface';
export * from  './lib/model/scheduling-project-module-add-on.model';
export * from  './lib/model/lookup/activity-template-lookup-provider.interface';
export * from './lib/model/lookup/activity-template-group-lookup-provider.interface';
export * from './lib/model/lookup/scheduling-activity-lookup-provider.interface';
export * from './lib/model/lookup/scheduling-schedule-lookup-provider.interface';
export * from './lib/model/lookup/scheduling-calendar-lookup-provider.interface';
export * from './lib/model/scheduling-calendar-complete.class';
export * from './lib/model/entities/scheduling-calendar-entity.interface';
export * from './lib/model/entities/scheduling-calendar-workday-entity.interface';
export * from './lib/model/entities/scheduling-calendar-week-day-entity.interface';
export * from './lib/model/entities/scheduling-calendar-work-hour-entity.interface';
export * from './lib/model/entities/scheduling-calendar-exception-day-entity.interface';
export * from './lib/model/lookup/scheduling-main-event-lookup-provider.interface';
export * from './lib/model/lookup/scheduling-progress-report-line-item-header-lookup-provider.interface';
export * from './lib/model/lookup/scheduling-main-activity-2model-object-lookup-provider.interface';
/**
 * Returns the module info object for the scheduling interfaces module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */
export function getModuleInfo(): IApplicationModuleInfo {
	return SchedulingInterfacesModuleInfo.instance;
}
