/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsSummarizedMatEntity } from '../model/models';

export const PPS_MATERIAL_SUMMARIZED_BEHAVIOR_TOKEN = new InjectionToken<PpsMaterialSummarizedBehavior>('ppsMaterialSummarizedBehavior');

@Injectable({
	providedIn: 'root'
})
export class PpsMaterialSummarizedBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsSummarizedMatEntity>, IPpsSummarizedMatEntity> {

}