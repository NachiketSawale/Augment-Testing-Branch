/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	IProcurementCommonDeliveryScheduleEntity,
	ProcurementCommonDeliveryScheduleDataService
} from '@libs/procurement/common';
import { IConItemEntity } from '../model/entities';
import { ConItemComplete } from '../model/con-item-complete.class';
import { ProcurementContractItemDataService } from './procurement-contract-item-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementContractDeliveryScheduleProcessor } from './processors/procurement-contract-deliveryschedule-readonly-processor.service';


export const PROCUREMENT_CONTRACT_DELIVERY_SCHEDULE_DATA_TOKEN = new InjectionToken<ProcurementContractDeliveryScheduleDataService>('procurementContractDeliveryscheduleDataService');


/**
 * DeliverySchedule service in contract
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractDeliveryScheduleDataService extends ProcurementCommonDeliveryScheduleDataService<IProcurementCommonDeliveryScheduleEntity,IConItemEntity, ConItemComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementContractItemDataService);
		super(parentService,ProcurementInternalModule.Contract);
	}

	protected getMainItemId(parent: IConItemEntity): number {
		return parent.Id;
	}

	protected getMainItemStatus(parent: IConItemEntity): number {
		return parent.PrcItemstatusFk;
	}

	protected createReadonlyProcessor(){
		return new ProcurementContractDeliveryScheduleProcessor(this);
	}

	public override isParentFn(parentKey: IConItemEntity, entity: IProcurementCommonDeliveryScheduleEntity): boolean {
		return entity.PrcItemFk === parentKey.PrcItemFk;
	}
	
}