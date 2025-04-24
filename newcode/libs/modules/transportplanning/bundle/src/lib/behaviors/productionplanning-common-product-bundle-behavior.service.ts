/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IPpsProductEntityGenerated } from '@libs/productionplanning/shared';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

export const PRODUCTIONPLANNING_COMMON_PRODUCT_BUNDLE_BEHAVIOR_TOKEN = new InjectionToken<ProductionplanningCommonProductBundleBehavior>('productionplanningCommonProductBundleBehavior');

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningCommonProductBundleBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsProductEntityGenerated>, IPpsProductEntityGenerated> {

}