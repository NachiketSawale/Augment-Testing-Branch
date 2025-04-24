/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonDeliveryScheduleEntity, ProcurementCommonDeliveryScheduleDataService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { RequisitionItemsDataService } from './requisition-items-data.service';
import { ProcurementRequisitionDeliveryScheduleProcessor } from './processors/procurement-requisition-delivery-schedule-readonly-processor.service';

/**
 * DeliverySchedule service in requisition
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionDeliveryScheduleDataService extends ProcurementCommonDeliveryScheduleDataService<IProcurementCommonDeliveryScheduleEntity, IReqItemEntity, ReqItemComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(RequisitionItemsDataService);
		super(parentService, ProcurementInternalModule.Requisition);
	}

	protected getMainItemId(parent: IReqItemEntity): number {
		return parent.Id;
	}

	protected getMainItemStatus(parent: IReqItemEntity): number {
		return parent.PrcItemstatusFk;
	}

	protected createReadonlyProcessor() {
		return new ProcurementRequisitionDeliveryScheduleProcessor(this);
	}

	
	public override isParentFn(parentKey: IReqItemEntity, entity: IProcurementCommonDeliveryScheduleEntity): boolean {
		return entity.PrcItemFk === parentKey.PrcItemFk;
	}
}
