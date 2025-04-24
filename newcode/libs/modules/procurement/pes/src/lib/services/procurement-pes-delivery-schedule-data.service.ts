/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	IProcurementCommonDeliveryScheduleEntity,
	ProcurementCommonDeliveryScheduleDataService
} from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IPesItemEntity } from '../model/entities';
import { ProcurementPesItemDataService } from './procurement-pes-item-data.service';
import { ProcurementPesDeliveryScheduleReadonlyProcessor } from './processors/procurement-pes-delivery-schedule-readonly-processor.service';
import { PesItemComplete } from '../model/complete-class/pes-item-complete.class';


export const PROCUREMENT_PES_DELIVERY_SCHEDULE_DATA_TOKEN = new InjectionToken<ProcurementPesDeliveryScheduleDataService>('procurementPesDeliveryScheduleDataService');


/**
 * DeliverySchedule service in pes
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPesDeliveryScheduleDataService extends ProcurementCommonDeliveryScheduleDataService<IProcurementCommonDeliveryScheduleEntity,IPesItemEntity, PesItemComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementPesItemDataService);
		super(parentService, ProcurementInternalModule.Pes);

		parentService.entityProxy.propertyChanged$.subscribe(async e => {
			switch (e.field) {
				case 'PrcItemFk': {
					if (e.entity === this.getSelectedParent()) {
						await this.reload(e.newValue as number);
					}
				}
			}
		});
	}

	protected getMainItemId(parent: IPesItemEntity): number {
		if(parent.PrcItemFk) {
			return parent.PrcItemFk;
		}
		throw new Error('The main entity should be selected!');
	}

	protected getMainItemStatus(parent: IPesItemEntity): number {
		if(parent.PrcItemStatusFk) {
			return parent.PrcItemStatusFk;
		}
		throw new Error('The main entity should be selected!');
	}

	protected createReadonlyProcessor(){
		return new ProcurementPesDeliveryScheduleReadonlyProcessor(this);
	}

	public override isParentFn(parentKey: IPesItemEntity, entity: IProcurementCommonDeliveryScheduleEntity): boolean {
		return entity.PrcItemFk === parentKey.PrcItemFk;
	}
}