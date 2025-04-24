import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceMaintenanceModuleInfo } from './lib/model/resource-maintenance-module-info.class';

export * from './lib/resource-maintenance.module';

export function getModuleInfo(): IApplicationModuleInfo {
	return ResourceMaintenanceModuleInfo.instance;
}

export * from './lib/services/resource-maintenance-lookup-provider.service';