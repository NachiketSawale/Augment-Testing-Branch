/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SalesWipLineItemDataService } from '../../services/sales-wip-line-item-data.service';
import {ISalesLineItemQuantityEntity } from '../entities/sales-line-item-quantity-entity.interface';
import { SalesWipLineItemBehaviourService } from '../../behaviors/sales-wip-line-item-behaviour.service';
import {WipEstLineItemBaseLayoutService} from './wip-est-line-item-base-layout.service';

/**
 * Estimate Line Item Entity Info
 */
export const SALES_LINE_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<ISalesLineItemQuantityEntity> ({
	grid: {
		title: {key: 'sales.wip.estimateLineItemGridContainer'},
		behavior: ctx => ctx.injector.get(SalesWipLineItemBehaviourService),
	},
	dataService: ctx => ctx.injector.get(SalesWipLineItemDataService),
	dtoSchemeId: {moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemDto'},
	permissionUuid: 'cded11c87949495981aa62795c2c4011',
	layoutConfiguration: (context) => context.injector.get(WipEstLineItemBaseLayoutService).generateLayout(),
});