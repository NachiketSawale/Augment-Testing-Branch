/*
 * Copyright(c) RIB Software GmbH
 */


import { EntityInfo } from '@libs/ui/business-base';
import { IBillHeaderEntity } from '../entities/bill-header-entity.interface';
import { SalesWipRelatedBillBehaviourService } from '../../behaviors/sales-wip-related-bill-behaviour.service';
import { SalesWipRelatedBillLayoutService } from './sales-wip-related-bill-layout.service';
import { SalesWipRelatedBillDataService } from '../../services/sales-wip-related-bill-data.service';


export const SALES_WIP_RELATED_BILL_ENTITY_INFO: EntityInfo = EntityInfo.create<IBillHeaderEntity> ({
	grid: {
		title: {key: 'sales.wip.relatedBills'},
		behavior: ctx => ctx.injector.get(SalesWipRelatedBillBehaviourService),
	},
	dataService: ctx => ctx.injector.get(SalesWipRelatedBillDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Billing', typeName: 'BilHeaderDto'},
	permissionUuid: '39608924dc884afea59fe04cb1434543',
	layoutConfiguration: (context) => context.injector.get(SalesWipRelatedBillLayoutService).generateLayout(),
});