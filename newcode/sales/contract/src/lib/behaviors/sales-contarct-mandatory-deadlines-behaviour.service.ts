/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ISharedMandatoryDeadlinesEntity } from '@libs/sales/shared';

@Injectable({
	providedIn: 'root'
})
export class SalesContractMandatoryDeadlinesBehavior implements IEntityContainerBehavior<IGridContainerLink<ISharedMandatoryDeadlinesEntity>, ISharedMandatoryDeadlinesEntity> {

}