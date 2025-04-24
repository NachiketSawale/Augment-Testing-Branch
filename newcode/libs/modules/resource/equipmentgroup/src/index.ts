import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceEquipmentGroupModuleInfo } from './lib/model/resource-equipment-group-module-info.class';

export * from './lib/resource-equipment-group.module';
export * from './lib/services/equipment-group-lookup-provider.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return ResourceEquipmentGroupModuleInfo.instance;
}
