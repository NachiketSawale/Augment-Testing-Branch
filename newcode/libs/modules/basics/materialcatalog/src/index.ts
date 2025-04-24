import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsMaterialcatalogModuleInfo } from './lib/model/basics-materialcatalog-module-info.class';

export * from './lib/basics-materialcatalog.module';
export * from './lib/material-catalog/basics-material-catalog-layout.service';
export * from './lib/material-group/basics-material-group-layout.service';
export * from './lib/model/wizards/wizard.class';

export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsMaterialcatalogModuleInfo.instance;
}

export * from './lib/service/wizards';
export * from './lib/model/entities/material-price-version-entity.interface';
