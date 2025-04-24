/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IOrdMilestoneEntity } from '@libs/sales/interfaces';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class SalesContractMilestonesBehavior implements IEntityContainerBehavior<IGridContainerLink<IOrdMilestoneEntity>, IOrdMilestoneEntity> {

}