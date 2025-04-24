/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelProjectModuleInfo } from './lib/model/model-project-module-info.class';

export * from './lib/model-project.module';

export * from './lib/model/model-project-module-add-on.class';

export * from './lib/services/model-lookup-provider.service';

export * from './lib/model/wizards/wizard.class';

/**
 * Returns the module info object for the model project module.
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
	return ModelProjectModuleInfo.instance;
}
