import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingEmployeeModuleInfo } from './lib/model/timekeeping-employee-module-info.class';

export * from './lib/timekeeping-employee.module';
export * from './lib/model/wizards/timekeeping-employee-wizard.class';
export * from './lib/services/timekeeping-crew-leader-lookup-provider.service';
export * from './lib/services/timekeeping-employee-certification-lookup-provider.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return TimekeepingEmployeeModuleInfo.instance;
}