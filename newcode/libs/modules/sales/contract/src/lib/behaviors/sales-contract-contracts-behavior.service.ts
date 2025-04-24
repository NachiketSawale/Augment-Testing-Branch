/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class SalesContractContractsBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdHeaderEntity>, IOrdHeaderEntity> {

}