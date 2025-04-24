import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceMasterModuleInfo } from './lib/model/resource-master-module-info.class';

export * from './lib/resource-master.module';
export * from './lib/services/data/resource-master-resource-data.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return ResourceMasterModuleInfo.instance;
}

export * from './lib/services/resource-master-lookup-provider.service';