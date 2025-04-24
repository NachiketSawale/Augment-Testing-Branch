/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BoqInterfacesModuleInfo } from './lib/model/boq-interfaces-module-info.class';

export * from './lib/boq-interfaces.module';
export * from './lib/model/boq-project-module-add-on.model';
export * from './lib/model/boq-main-item-ref-no-lookup.model';
export * from './lib/services/boq-wizard-register.service';
export * from './lib/model/boq-wizard-uuid-constants.class';
export * from './lib/model/index';

/**
 * Returns the module info object for the boq interfaces module.
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
	return BoqInterfacesModuleInfo.instance;
}
