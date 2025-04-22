/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from './application-module-info.interface';

/**
 * The basic interface common to all application modules.
 *
 * This interface is supposed to be implemented by the module itself, i.e. the implicit object
 * returned by the `import()` function. As that type is not explicitly declared, interface
 * implementation must also happen implicitly, by making sure that all members required by
 * this interface are supplied.
 *
 * @group Module Management
 */
export interface IApplicationModule {

	/**
	 * Retrieves the module info object instance for the module.
	 */
	getModuleInfo(): IApplicationModuleInfo;
}
