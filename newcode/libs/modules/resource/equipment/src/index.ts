/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceEquipmentModuleInfo } from './lib/model/resource-equipment-module-info.class';

export * from './lib/resource-equipment.module';
export * from './lib/model/wizards/wizard.class';

/*export for equipment services*/
export * from './lib/services/index';
export * from './lib/components/catalog-records/catalog-records.component';


export function getModuleInfo(): IApplicationModuleInfo {
	return ResourceEquipmentModuleInfo.instance;
}

export * from './lib/services/resource-equipment-lookup-provider.service';