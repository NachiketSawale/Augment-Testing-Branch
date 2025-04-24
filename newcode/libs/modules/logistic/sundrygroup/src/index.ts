import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticSundryGroupModuleInfo } from './lib/model/logistic-sundry-service-group-module-info.class';

export { LogisticSundryServiceGroupDataService } from './lib/services/logistic-sundry-service-group-data.service';
export * from './lib/logistic-sundrygroup.module';

export * from './lib/model/wizards/wizard.class';

export function getModuleInfo(): IApplicationModuleInfo {
	return LogisticSundryGroupModuleInfo.instance;
}
