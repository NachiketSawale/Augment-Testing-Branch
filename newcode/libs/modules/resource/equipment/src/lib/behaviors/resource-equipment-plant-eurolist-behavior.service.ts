/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IPlantEurolistEntity } from '@libs/resource/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

export const RESOURCE_EQUIPMENT_PLANT_EUROLIST_BEHAVIOR_TOKEN = new InjectionToken<ResourceEquipmentPlantEurolistBehavior>('resourceEquipmentPlantEurolistBehavior');

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantEurolistBehavior implements IEntityContainerBehavior<IGridContainerLink<IPlantEurolistEntity>, IPlantEurolistEntity> {

}