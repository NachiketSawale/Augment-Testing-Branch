/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsFormulaEntity } from '../model/models';

@Injectable({
	providedIn: 'root'
})
export class PpsFormulaBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsFormulaEntity>, IPpsFormulaEntity> {
}