import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsSiteModuleInfo } from './lib/model/basics-site-module-info.class';

export * from './lib/basics-site.module';
export * from './lib/model/basics-site-grid-entity.class';
export * from './lib/model/schema/wizards/basics-site-wizard.class';
export * from './lib/services/lookups';

export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsSiteModuleInfo.instance;
}
