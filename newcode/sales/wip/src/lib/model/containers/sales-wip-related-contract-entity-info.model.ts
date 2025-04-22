/*
 * Copyright(c) RIB Software GmbH
 */


import { EntityInfo } from '@libs/ui/business-base';
import { SalesWipRelatedContractBehaviourService } from '../../behaviors/sales-wip-related-contract-behaviour.service';
import { SalesWipRelatedContractDataService } from '../../services/sales-wip-related-contract-data.service';
import { SalesWipRelatedContractLayoutService } from './sales-wip-related-contract-layout.service';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';



export const SALES_WIP_RELATED_CONTRACT_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdHeaderEntity> ({
	grid: {
		title: {key: 'sales.wip.containerTitleContracts'},
		behavior: ctx => ctx.injector.get(SalesWipRelatedContractBehaviourService),
	},
	dataService: ctx => ctx.injector.get(SalesWipRelatedContractDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdHeaderDto'},
	permissionUuid: '34d0a7ece4f34f2091f7ba6c622ff04d',
	layoutConfiguration: (context) => context.injector.get(SalesWipRelatedContractLayoutService).generateLayout(),
});