import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceTypeModuleInfo } from './lib/model/resource-type-module-info.class';

export * from './lib/resource-type.module';
export * from './lib/services/lookup/resource-type-lookup-provider.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return ResourceTypeModuleInfo.instance;
}
