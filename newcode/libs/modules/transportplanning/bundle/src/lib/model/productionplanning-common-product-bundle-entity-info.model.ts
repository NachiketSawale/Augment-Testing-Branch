/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
//import { IProductEntity} from '@libs/productionplanning/common';
import {IPpsProductEntityGenerated, PpsProductSharedLayout} from '@libs/productionplanning/shared';
//import { ProductionplanningCommonProductBundleDataService } from '../services/productionplanning-common-product-bundle-data.service';
import { ProductionplanningCommonProductBundleBehavior } from '../behaviors/productionplanning-common-product-bundle-behavior.service';
import { TransportplanningBundleGridDataService } from '../services/transportplanning-bundle-grid-data.service';
import { runInInjectionContext } from '@angular/core';
import { ProductionplanningCommonProductBundleDataService } from '../services/productionplanning-common-product-bundle-data.service';


 export const PRODUCTIONPLANNING_COMMON_PRODUCT_BUNDLE_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsProductEntityGenerated> ({
                grid: {
                    title: {key: 'productionplanning.common.product.bundleProductTitle'},
						   behavior: ctx => ctx.injector.get(ProductionplanningCommonProductBundleBehavior),
                },
                 form: {
                     title: { key: 'productionplanning.common.product' + '.bundleProductDetailTitle' },
                     containerUuid: '1d2b2bf19d0d44b88539ccu58db79d18',
                     },
                     dataService: ctx =>   runInInjectionContext(ctx.injector, () => {
                        const instance = ProductionplanningCommonProductBundleDataService.getInstance('TransportPlanning.Bundle', ctx.injector.get(TransportplanningBundleGridDataService));
                        return instance;
                    }),     
                dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Common', typeName: 'ProductDto'},
                permissionUuid: 'd8c96cdc54a840bfb7651c3228f19887',
                layoutConfiguration: PpsProductSharedLayout
            });