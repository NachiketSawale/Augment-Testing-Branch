/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelChangesetModuleInfo } from './lib/model/model-changeset-module-info.class';

export * from './lib/model-changeset.module';
export * from './lib/services/lookup/model-shared-change-set-lookup.service';
export * from './lib/wizards/model-change-set-wizard-class';
/**
 * Returns the module info object for the model changeset module.
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
	return ModelChangesetModuleInfo.instance;
}
