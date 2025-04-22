/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IProcurementCommonDeliveryScheduleEntity } from '@libs/procurement/common';
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesDeliveryScheduleGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IProcurementCommonDeliveryScheduleEntity>, IProcurementCommonDeliveryScheduleEntity>{

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<IProcurementCommonDeliveryScheduleEntity>): void {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord, EntityContainerCommand.DeleteRecord]);
	}

}