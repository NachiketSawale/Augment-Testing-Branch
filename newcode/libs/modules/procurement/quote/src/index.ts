/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementQuoteModuleInfo } from './lib/model/procurement-quote-module-info.class';

export * from './lib/procurement-quote.module';
export * from './lib/model/index';
export * from './lib/model/wizards/wizards.class';
export * from './lib/services/procurement-quote-item-data.service';
export * from './lib/services/quote-requisitions-data.service';
export * from './lib/services/quote-header-data.service';
export * from './lib/services/procurement-quote-boq.service';

/**
 * Returns the module info object for the procurement quote module.
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
	return ProcurementQuoteModuleInfo.instance;
}

export * from './lib/services/wizards/procurement-quote-update-item-price-wizard.service';
export * from './lib/services/wizards/procurement-quote-increase-version-wizard.service';