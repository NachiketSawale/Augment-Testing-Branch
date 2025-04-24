import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsCharacteristicModuleInfo } from './lib/model/basics-characteristic-module-info.class';

export * from './lib/basics-characteristic.module';

export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsCharacteristicModuleInfo.instance;
}