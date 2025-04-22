/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerCommand, IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IProcurementCommonDeliveryScheduleEntity } from '@libs/procurement/common';
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesDeliveryScheduleFormBehavior implements IEntityContainerBehavior<IFormContainerLink<IProcurementCommonDeliveryScheduleEntity>, IProcurementCommonDeliveryScheduleEntity>{

	public constructor() {
	}

	public onCreate(containerLink: IFormContainerLink<IProcurementCommonDeliveryScheduleEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}