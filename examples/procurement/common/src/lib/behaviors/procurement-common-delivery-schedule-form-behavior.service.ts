/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import {Injectable} from '@angular/core';
import { IProcurementCommonDeliveryScheduleEntity } from '../model/entities/procurement-common-deliveryschedule-entity.interface';
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonDeliveryScheduleFormBehavior implements IEntityContainerBehavior<IFormContainerLink<IProcurementCommonDeliveryScheduleEntity>, IProcurementCommonDeliveryScheduleEntity>{

	public constructor() {
	}

	public onCreate(containerLink: IFormContainerLink<IProcurementCommonDeliveryScheduleEntity>): void {}

}