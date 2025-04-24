import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingSettlementModuleInfo } from './lib/model/timekeeping-settlement-module-info.class';

export { TimekeepingSettlementDataService } from './lib/services/timekeeping-settlement-data.service';
export * from './lib/timekeeping-settlement.module';
export * from './lib/model/wizards/timekeeping-settlement-wizard.class';
export * from './lib/services/wizards/timekeeping-settlement-change-status-wizard.service';
export function getModuleInfo(): IApplicationModuleInfo {
    return TimekeepingSettlementModuleInfo.instance;
}