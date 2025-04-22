/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase } from './business-module-info-base.class';
import { ContainerModuleRoute } from '@libs/ui/container-system';

/**
 * Stores routing information for a standard container-based business module.
 */
export class BusinessModuleRoute extends ContainerModuleRoute {

	/**
	 * Initializes a new instance.
	 * @param {BusinessModuleInfoBase} moduleInfo The module info object for the module.
	 */
	public constructor(moduleInfo: BusinessModuleInfoBase) {
		super(moduleInfo);
	}
}