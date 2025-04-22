/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelAnnotationModuleInfo } from './lib/model/model-annotation-module-info.class';

export * from './lib/model-annotation.module';

export * from './lib/services/model-annotation-lookup-provider.service';
export * from './lib/wizards/wizard.class';
/**
 * Returns the module info object for the model annotation module.
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
	return ModelAnnotationModuleInfo.instance;
}

export * from './lib/model/entities/model-annotation-camera-entity.interface';
export * from './lib/model/entities/model-annotation-object-link-entity.interface';
export * from './lib/model/entities/model-annotation-marker-entity.interface';

