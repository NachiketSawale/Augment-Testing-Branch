/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsCad2mdcMaterialEntity } from '../model/models';

export const PPS_CAD_TO_MATERIAL_BEHAVIOR_TOKEN = new InjectionToken<PpsCadToMaterialBehavior>('ppsCadToMaterialBehavior');

@Injectable({
	providedIn: 'root'
})
export class PpsCadToMaterialBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsCad2mdcMaterialEntity>, IPpsCad2mdcMaterialEntity> {

}