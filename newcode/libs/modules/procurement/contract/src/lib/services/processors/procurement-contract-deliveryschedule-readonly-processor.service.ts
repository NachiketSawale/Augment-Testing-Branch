/*
 * Copyright(c) RIB Software GmbH
 */
import { IProcurementCommonDeliveryScheduleEntity,ProcurementCommonDeliveryScheduleProcessor } from '@libs/procurement/common';
import { IConItemEntity } from '../../model/entities';
import { ConItemComplete } from '../../model/con-item-complete.class';
import { ProcurementContractDeliveryScheduleDataService } from '../procurement-contract-deliveryschedule-data.service';
import { ReadonlyFunctions } from '@libs/basics/shared';

export class ProcurementContractDeliveryScheduleProcessor extends ProcurementCommonDeliveryScheduleProcessor<IProcurementCommonDeliveryScheduleEntity,IConItemEntity,ConItemComplete> {

	public constructor(protected deliveryscheduleDataService:ProcurementContractDeliveryScheduleDataService){
		super(deliveryscheduleDataService);
	}

	public isReadonly(): boolean {
		return false;
	}


	public override generateReadonlyFunctions(): ReadonlyFunctions<IProcurementCommonDeliveryScheduleEntity>{
		return {...super.generateReadonlyFunctions()};
	}
}