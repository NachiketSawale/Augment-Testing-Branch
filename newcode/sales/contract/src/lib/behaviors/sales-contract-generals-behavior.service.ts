/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IGeneralsEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class SalesContractGeneralsBehavior implements IEntityContainerBehavior<IGridContainerLink<IGeneralsEntity>, IGeneralsEntity> {

}