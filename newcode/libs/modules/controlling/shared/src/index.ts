import { IApplicationModuleInfo } from '@libs/platform/common';
import { moduleInfo } from './lib/controlling-shared.module';

export * from './lib/controlling-shared.module';

export function getModuleInfo(): IApplicationModuleInfo {
	return moduleInfo;
}

export * from './lib/lookup-services';
export * from './lib/controlling-group-set';