/*
 * Copyright(c) RIB Software GmbH
 */
import { IProcurementCommonDeliveryScheduleEntity,ProcurementCommonDeliveryScheduleProcessor } from '@libs/procurement/common';
import { IPesItemEntity } from '../../model/entities';
import { ReadonlyFunctions } from '@libs/basics/shared';
import { ProcurementPesDeliveryScheduleDataService } from '../procurement-pes-delivery-schedule-data.service';
import { PesItemComplete } from '../../model/complete-class/pes-item-complete.class';

export class ProcurementPesDeliveryScheduleReadonlyProcessor extends ProcurementCommonDeliveryScheduleProcessor<IProcurementCommonDeliveryScheduleEntity,IPesItemEntity,PesItemComplete> {

	public constructor(protected deliveryscheduleDataService:ProcurementPesDeliveryScheduleDataService){
		super(deliveryscheduleDataService);
	}

	public isReadonly(): boolean {
		return true;
	}


	public override generateReadonlyFunctions(): ReadonlyFunctions<IProcurementCommonDeliveryScheduleEntity>{
		return {...super.generateReadonlyFunctions(),
			DateRequired:e=> true,
			TimeRequired:e=> true,
			Description:e=> true,
			Quantity:e=> true,
			CommentText:e=> true,
			RunningNumber:e=> true,
			AddressDto:e=> true,
		};
	}
}