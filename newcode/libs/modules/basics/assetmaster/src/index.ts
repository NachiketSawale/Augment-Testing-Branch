/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsAssetmasterModuleInfo } from './lib/model/basics-assetmaster-module-info.class';

export * from './lib/basics-assetmaster.module';

/**
 * Returns the module info object for the basics assetmaster module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */
export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsAssetmasterModuleInfo.instance;
}

export * from './lib/wizards/basics-asset-master-enable-wizard.service';

export * from './lib/wizards/basics-asset-master-disable-wizard.service';