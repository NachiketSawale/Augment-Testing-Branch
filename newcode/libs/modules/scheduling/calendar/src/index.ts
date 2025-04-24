import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingCalendarModuleInfo } from './lib/model/scheduling-calendar-module-info.class';
export * from './lib/scheduling-calendar.module';
export * from './lib/wizards/scheduling-calendar-main-wizard.class';
export * from './lib/services/scheduling-calendar-data.service';
export * from './lib/services/lookup/scheduling-calendar-lookup-without-endpoint.service';
export * from './lib/services/scheduling-calendar-lookup-provider.service';
export * from './lib/wizards/scheduling-calendar-disable-wizard.service';
export * from './lib/wizards/scheduling-calendar-exceptionday-wizard.service';
export * from './lib/wizards/scheduling-calendar-enable-wizard.service';
export function getModuleInfo(): IApplicationModuleInfo {
    return SchedulingCalendarModuleInfo.instance;
}

