/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonEventsGridBehavior<IProcurementCommonEventsEntity extends object> implements IEntityContainerBehavior<IGridContainerLink<IProcurementCommonEventsEntity>, IProcurementCommonEventsEntity>{

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<IProcurementCommonEventsEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}
}