/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IOrdAdvanceEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class SalesContractAdvanceBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdAdvanceEntity>, IOrdAdvanceEntity> {

}