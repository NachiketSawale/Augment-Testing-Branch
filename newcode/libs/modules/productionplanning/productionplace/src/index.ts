import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningProductionPlaceModuleInfo } from './lib/model/production-place-module-info.class';

export * from './lib/productionplanning-production-place.module';
export * from './lib/services/wizards/pps-production-place-disable-wizard.service';
export * from './lib/services/wizards/pps-production-place-enable-wizard.service';
export * from './lib/services/lookup/pps-production-place-common-lookup.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return ProductionplanningProductionPlaceModuleInfo.instance;
}
