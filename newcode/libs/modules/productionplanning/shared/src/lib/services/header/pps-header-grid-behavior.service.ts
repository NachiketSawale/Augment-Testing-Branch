/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsHeaderEntity } from '../../model/header/pps-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsHeaderEntity>, IPpsHeaderEntity> {

}