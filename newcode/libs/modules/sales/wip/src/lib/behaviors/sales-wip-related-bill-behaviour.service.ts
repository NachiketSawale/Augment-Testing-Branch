/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesWipRelatedBillBehaviourService implements IEntityContainerBehavior<IGridContainerLink<IBillHeaderEntity>, IBillHeaderEntity> {

}