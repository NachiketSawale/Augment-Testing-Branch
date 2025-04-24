/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonSplitOverallDiscountWizardService } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractSplitOverallDiscountWizardService extends ProcurementCommonSplitOverallDiscountWizardService<IConHeaderEntity, ContractComplete> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService),
			apiUrl: 'procurement/contract/header/splitoveralldiscount',
		});
	}
}
