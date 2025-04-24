/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsMeetingModuleInfo } from './lib/model/basics-meeting-module-info.class';

export * from './lib/basics-meeting.module';
export * from './lib/model/wizards/wizard.class';

/**
 * Returns the module info object for the basics meeting module.
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
	return BasicsMeetingModuleInfo.instance;
}
