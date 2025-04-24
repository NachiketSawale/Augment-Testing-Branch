/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {
    EstimateMainLineItemQuantityDataService
} from './estimate-main-line-item-quantity-data.service';
import {
    EstimateMainLineItemQuantityBehavior
} from './estimate-main-line-item-quantity-behavior.service';
import {IEstLineItemQuantityEntity} from '@libs/estimate/interfaces';
import {EstimateMainLineItemQuantityLayoutService} from './estimate-main-line-item-quantity-layout.service';

/**
 * The entity info object for the Estimate Main LineItem Quantity
 */
export const ESTIMATE_MAIN_LINE_ITEM_QUANTITY_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstLineItemQuantityEntity>({
    grid: {
        title: {key: 'estimate.main.lineItemQuantityContainer'},
        containerUuid: '9cc2043da33141f78511adf92662cfb9',
        behavior: ctx => ctx.injector.get(EstimateMainLineItemQuantityBehavior),
    },

    // Define data service token using dependency injection
    dataService: ctx => ctx.injector.get(EstimateMainLineItemQuantityDataService),

    // Define DTO scheme ID
    dtoSchemeId: {moduleSubModule: 'Estimate.Main', typeName: 'EstLineItemQuantityDto'},

    // Define permission UUID
    permissionUuid: '681223e37d524ce0b9bfa2294e18d650',

    // Define layout configuration using dependency injection
    layoutConfiguration: (context) => {
        return context.injector.get(EstimateMainLineItemQuantityLayoutService).generateConfig();
    }
});