import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementContractModuleInfo } from './lib/model/procurement-contract-module-info.class';

export * from './lib/procurement-contract.module';
export { ProcurementContractChangeStatusWizardService } from './lib/wizards/procurement-contract-change-status-wizard.service';
export { ProcurementContractChangeItemStatusWizardService } from './lib/wizards/procurement-contract-change-item-status-wizard.service';

export * from './lib/wizards';
export * from './lib/services/procurement-contract-header-data.service';
export * from './lib/services/entity-info/con-header-entity-info.service';
export * from './lib/services/layout/procurement-contract-businesspartner-layout.service';
export * from './lib/services/layout/contract-confirm-detail-layout.service';
export * from './lib/lookups/con-header-purchase-orders-lookup.service';
export * from './lib/model/entity-info/procurement-contract-boq-entity-info.model';
export * from './lib/services/entity-info/prc-contract-boq-entity-info.service';
export * from './lib/services/procurement-contract-boq.service';
export * from './lib/services/layout/procurement-contract-certificate-layout.service';
export * from './lib/model/entity-info/contract-approval-general-entity-info.service';
export * from './lib/services/layout/procurement-contract-total-layout.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return ProcurementContractModuleInfo.instance;
}
