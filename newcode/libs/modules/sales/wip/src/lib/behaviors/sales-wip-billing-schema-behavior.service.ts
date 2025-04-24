/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesWipBillingSchemaBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IWipHeaderEntity>, IWipHeaderEntity> {

}