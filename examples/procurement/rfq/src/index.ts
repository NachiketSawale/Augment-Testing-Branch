/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementRfqModuleInfo } from './lib/model/procurement-rfq-module-info.class';

export * from './lib/procurement-rfq.module';
export * from './lib/services/base/rfq-header-data-base.service';
export * from './lib/services/entity-info/rfq-header-entity-info.service';

export * from './lib/wizards';
export * from './lib/model/entities/rfq-header-entity-complete.class';
export * from './lib/model/entities/rfq-partialreq-assigned-entity.interface';

export * from './lib/model/classes/rfq-header-entity-config.class';
export { ProcurementRfqHeaderMainDataService } from './lib/services/procurement-rfq-header-main-data.service';
export * from './lib/services/entity-info/rfq-header-entity-info-config.service';
export * from './lib/services/entity-info/rfq-bidder-entity-info-config.service';
export * from './lib/services/layouts/rfq-business-partner-layout.service';
export * from './lib/services/rfq-businesspartner-portal-user-management.service';
export * from './lib/services/layouts/procurement-rfq-layout.service';

/**
 * Returns the module info object for the procurement rfq module.
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
	return ProcurementRfqModuleInfo.instance;
}

export * from './lib/model/wizards/wizard.class';
