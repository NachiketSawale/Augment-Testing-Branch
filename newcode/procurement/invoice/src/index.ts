/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementInvoiceModuleInfo } from './lib/model/procurement-invoice-module-info.class';

export * from './lib/procurement-invoice.module';
export * from './lib/wizards';
export * from './lib/model/entities/index';
/**
 * Returns the module info object for the procurement invoice module.
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
	return ProcurementInvoiceModuleInfo.instance;
}
