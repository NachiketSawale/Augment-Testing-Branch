/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { DocumentsInterfacesModuleInfo } from './lib/model/documents-interfaces-module-info.class';

export * from './lib/documents-interfaces.module';
export * from './lib/model/index';

/**
 * Returns the module info object for the documents interfaces module.
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
	return DocumentsInterfacesModuleInfo.instance;
}
