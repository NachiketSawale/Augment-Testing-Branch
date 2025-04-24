import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementTicketsystemModuleInfo } from './lib/model/procurement-ticketsystem-module-info';

export * from './lib/procurement-ticketsystem.module';
export function getModuleInfo(): IApplicationModuleInfo {
	return ProcurementTicketsystemModuleInfo.instance;
}
