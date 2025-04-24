/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsCostcodesModuleInfo } from './lib/model/basics-costcodes-module-info.class';

export * from './lib/basics-cost-codes.module';
export * from './lib/model/wizards/wizard.class';
export * from './lib/model/entities/cost-code-entity.interface';
export * from './lib/services/processor/basics-cost-codes-hourfactor-readonly-processor.service';
export * from './lib/services/lookups/basics-cost-code-lookup-provider.service';
export * from './lib/services/layout/basics-cost-codes-layout.service';
export * from './lib/services/processor/basics-costcodes-image-processor.service';

/**
 * Returns the module info object for the basics costcodes module.
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
	return BasicsCostcodesModuleInfo.instance;
}
