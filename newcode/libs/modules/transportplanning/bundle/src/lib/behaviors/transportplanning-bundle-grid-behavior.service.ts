/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBundleEntity } from '../model/entities/bundle-entity.interface';

export const TRANSPORTPLANNING_BUNDLE_GRID_BEHAVIOR_TOKEN = new InjectionToken<TransportplanningBundleGridBehavior>('transportplanningBundleGridBehavior');

@Injectable({
	providedIn: 'root'
})
export class TransportplanningBundleGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IBundleEntity>, IBundleEntity> {

}