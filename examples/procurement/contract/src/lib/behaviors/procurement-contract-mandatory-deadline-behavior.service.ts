/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { IPrcMandatoryDeadlineEntity } from '@libs/procurement/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractMandatoryDeadlineBehavior implements IEntityContainerBehavior<IGridContainerLink<IPrcMandatoryDeadlineEntity>, IPrcMandatoryDeadlineEntity> {
}