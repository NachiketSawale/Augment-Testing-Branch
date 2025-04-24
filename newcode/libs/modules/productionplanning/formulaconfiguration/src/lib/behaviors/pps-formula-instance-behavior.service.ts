/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsFormulaInstanceEntity } from '../model/models';

@Injectable({
	providedIn: 'root'
})
export class PpsFormulaInstanceBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsFormulaInstanceEntity>, IPpsFormulaInstanceEntity> {
}