import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticSharedModuleInfoClass } from './lib/model/logistic-shared-module-info.class';

export * from './lib/logistic-shared.module';

export * from './lib/services/lookup-helper/logistic-shared-lookup-overload-provider.class';

export * from './lib/services/common/logistic-common-context.service';
export * from './lib/services/lookup-services/index';
export * from './lib/model/logistic-shared-module-info.class';
export * from './lib/model/lookup';
export * from './lib/services/common/logistic-common-card-record.service';
export function getModuleInfo(): IApplicationModuleInfo {
	return LogisticSharedModuleInfoClass.instance;
}