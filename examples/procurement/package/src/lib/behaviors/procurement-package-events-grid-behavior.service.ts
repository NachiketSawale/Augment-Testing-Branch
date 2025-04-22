/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEventsGridBehavior<IProcurementCommonEventsEntity extends object> implements IEntityContainerBehavior<IGridContainerLink<IProcurementCommonEventsEntity>, IProcurementCommonEventsEntity> {
	public constructor() {}
}
