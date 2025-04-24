/*
 * Copyright(c) RIB Software GmbH
 */

import { ResourceCertificateModuleInfo } from './lib/model/resource-certificate-module-info.class';
import { IApplicationModuleInfo } from '@libs/platform/common';

export * from './lib/resource-certificate.module';
export * from './lib/model/wizards/resource-certificate-wizard.class';

/**
 * Returns the module info object for the resource certificate module.
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
	return ResourceCertificateModuleInfo.instance;
}
