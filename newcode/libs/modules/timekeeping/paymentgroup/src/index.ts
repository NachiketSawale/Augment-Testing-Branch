import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingPaymentgroupModuleInfo } from './lib/model/timekeeping-paymentgroup-module-info.class';

export { TimekeepingPaymentGroupDataService } from './lib/services/timekeeping-payment-group-data.service';
export * from './lib/timekeeping-paymentgroup.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return TimekeepingPaymentgroupModuleInfo.instance;
}