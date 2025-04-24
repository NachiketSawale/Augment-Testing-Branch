/*
 * Copyright(c) RIB Software GmbH
 */

import { ProductionplanningSharedPpsHeaderEntityInfoFactory } from '@libs/productionplanning/shared';
import { EntityInfo } from '@libs/ui/business-base';
import { SalesContractContractsDataService } from '../services/sales-contract-contracts-data.service';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_PPS_HEADER_ENTITY_INFO: EntityInfo = ProductionplanningSharedPpsHeaderEntityInfoFactory.create<IOrdHeaderEntity>({
	containerUuid: '99ce1ede67e44133a760b20adcd4a9aa',
	formContainerUuid: '685477983fdd4cdb971a5e7f12ab1a12',
	permissionUuid: '99ce1ede67e44133a760b20adcd4a9aa',
	foreignKey: 'OrdHeaderFk',
	parentServiceFn: (ctx) => ctx.injector.get(SalesContractContractsDataService),
});
