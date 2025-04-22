/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonGenerateDeliveryScheduleWizardService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { ConItemComplete } from '../model/con-item-complete.class';


@Injectable({
	providedIn: 'root'
})
export class ProcurementContractGenerateDeliveryScheduleWizardService
   extends ProcurementCommonGenerateDeliveryScheduleWizardService<IConHeaderEntity, ContractComplete, IConItemEntity, ConItemComplete, object, object> {

	public constructor() {

		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
			prcItemService: inject(ProcurementContractItemDataService),
			getInitStartDate: entity => entity.DateDelivery ? new Date(entity.DateDelivery) : new Date()
		});
	}

}