/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingRevrecognitionModuleInfo } from './lib/model/controlling-revrecognition-module-info.class';

export * from './lib/controlling-revrecognition.module';
export * from './lib/model/wizards/wizard.class';

/**
 * Returns the module info object for the controlling revrecognition module.
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
	return ControllingRevrecognitionModuleInfo.instance;
}
