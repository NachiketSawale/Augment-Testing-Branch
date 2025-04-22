/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementPricecomparisonModuleInfo } from './lib/model/procurement-pricecomparison-module-info.class';

export * from './lib/procurement-pricecomparison.module';

export * from './lib/services/wizard/compare-wizard.service';
export * from './lib/services/layouts/quote-by-request-layout.service';
export * from './lib/services/procurement-price-comparison-export-material-wizard.service';
export * from './lib/services/wizard/set-ad-hoc-price-wizard.service';
/**
 * Returns the module info object for the procurement pricecomparison module.
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
	return ProcurementPricecomparisonModuleInfo.instance;
}
