/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonSetBaseAlternateItemWizardService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ConItemComplete } from '../model/con-item-complete.class';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { ProcurementContractItemValidationService } from '../services/procurement-contract-item-validation.service';


@Injectable({
	providedIn: 'root'
})
export class ProcurementContractSetBaseAltItemWizardService extends ProcurementCommonSetBaseAlternateItemWizardService<IConHeaderEntity, ContractComplete, IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {

	public constructor() {

		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
			prcItemService: inject(ProcurementContractItemDataService),
			prcItemValidationService: inject(ProcurementContractItemValidationService),
		});
	}

}