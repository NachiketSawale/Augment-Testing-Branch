/*
 * Copyright(c) RIB Software GmbH
 */
import { IProcurementCommonDeliveryScheduleEntity, ProcurementCommonDeliveryScheduleProcessor } from '@libs/procurement/common';
import { ProcurementRequisitionDeliveryScheduleDataService } from '../procurement-requisition-delivery-schedule-data.service';
import { ReadonlyFunctions } from '@libs/basics/shared';
import { IReqItemEntity } from '../../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../../model/req-item-complete.class';

export class ProcurementRequisitionDeliveryScheduleProcessor extends ProcurementCommonDeliveryScheduleProcessor<IProcurementCommonDeliveryScheduleEntity, IReqItemEntity, ReqItemComplete> {
	public constructor(protected deliveryScheduleDataService: ProcurementRequisitionDeliveryScheduleDataService) {
		super(deliveryScheduleDataService);
	}

	public isReadonly(): boolean {
		return false;
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IProcurementCommonDeliveryScheduleEntity> {
		return { ...super.generateReadonlyFunctions() };
	}
}
