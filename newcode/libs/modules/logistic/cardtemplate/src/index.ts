import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticCardTemplateModuleInfo } from './lib/model/logistic-card-template-module-info.class';

export * from './lib/logistic-card-template.module';

export function getModuleInfo(): IApplicationModuleInfo {
	return LogisticCardTemplateModuleInfo.instance;
}

export * from './lib/services/logistic-card-template-lookup-provider.service';