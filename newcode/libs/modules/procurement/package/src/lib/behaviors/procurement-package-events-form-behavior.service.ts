/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEventsFormBehavior<IProcurementCommonEventsEntity extends object> implements IEntityContainerBehavior<IFormContainerLink<IProcurementCommonEventsEntity>, IProcurementCommonEventsEntity> {
	public constructor() {}
}
