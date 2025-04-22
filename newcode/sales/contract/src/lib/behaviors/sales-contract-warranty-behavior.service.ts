/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IOrdWarrantyEntity } from '@libs/sales/interfaces';

@Injectable({
	providedIn: 'root'
})
export class SalesContractWarrantyBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdWarrantyEntity>, IOrdWarrantyEntity> {

}