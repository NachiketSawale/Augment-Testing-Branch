/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IProcurementCommonDeliveryScheduleEntity } from '../model/entities/procurement-common-deliveryschedule-entity.interface';
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonDeliveryScheduleGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IProcurementCommonDeliveryScheduleEntity>, IProcurementCommonDeliveryScheduleEntity>{

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<IProcurementCommonDeliveryScheduleEntity>): void {}

}