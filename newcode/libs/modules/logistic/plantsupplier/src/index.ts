import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticPlantsupplierModuleInfo } from './lib/model/logistic-plantsupplier-module-info.class';

export * from './lib/logistic-plantsupplier.module';

export function getModuleInfo(): IApplicationModuleInfo {
	return LogisticPlantsupplierModuleInfo.instance;
}

export * from './lib/services/logistic-plantsupplier-lookup-provider.service';