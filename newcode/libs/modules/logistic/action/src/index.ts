import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticActionModuleInfo } from './lib/model/logistic-action-module-info.class';

export * from './lib/logistic-action.module';
export * from './lib/components/action-records/action-records.component';

export function getModuleInfo(): IApplicationModuleInfo {
	return LogisticActionModuleInfo.instance;
}

export * from './lib/services/logistic-action-lookup-provider.service';