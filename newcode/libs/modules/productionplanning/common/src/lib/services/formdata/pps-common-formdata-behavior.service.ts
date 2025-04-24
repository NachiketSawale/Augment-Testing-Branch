/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IPpsUserFormDataEntity } from '../../model/entities/pps-formdata-entity.interface';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PpsFormdataBehavior
	implements IEntityContainerBehavior<IGridContainerLink<IPpsUserFormDataEntity>, IPpsUserFormDataEntity> {

}
