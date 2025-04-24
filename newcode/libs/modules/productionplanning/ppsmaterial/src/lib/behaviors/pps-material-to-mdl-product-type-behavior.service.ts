/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsMaterial2MdlProductTypeEntity } from '../model/models';

export const PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_BEHAVIOR_TOKEN = new InjectionToken<PpsMaterialToMdlProductTypeBehavior>('ppsMaterialToMdlProductTypeBehavior');

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialToMdlProductTypeBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsMaterial2MdlProductTypeEntity>, IPpsMaterial2MdlProductTypeEntity> {

}