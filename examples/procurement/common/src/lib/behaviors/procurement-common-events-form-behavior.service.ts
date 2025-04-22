/*
 * Copyright(c) RIB Software GmbH
 */
import {IEntityContainerBehavior, IFormContainerLink} from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonEventsFormBehavior<IProcurementCommonEventsEntity extends object> implements IEntityContainerBehavior<IFormContainerLink<IProcurementCommonEventsEntity>, IProcurementCommonEventsEntity>{

	public constructor() {
	}

	public onCreate(containerLink: IFormContainerLink<IProcurementCommonEventsEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']);
	}

}