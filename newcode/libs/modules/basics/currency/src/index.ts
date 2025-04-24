import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsCurrencyModuleInfo } from './lib/model/basics-currency-module-info.class';

export * from './lib/basics-currency.module';

export* from './lib/lookups/basics-currency-lookup-provider.service'

export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsCurrencyModuleInfo.instance;
}
