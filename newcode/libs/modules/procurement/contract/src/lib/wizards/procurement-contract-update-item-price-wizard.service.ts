/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ProcurementCommonUpdateItemPriceWizardService, ProcurementModuleUpdatePriceWizard } from '@libs/procurement/common';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { ConItemComplete } from '../model/con-item-complete.class';


@Injectable({
	providedIn: 'root'
})
export class ProcurementContractUpdateItemPriceWizardService extends ProcurementCommonUpdateItemPriceWizardService<IConHeaderEntity, ContractComplete, IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityContract',
			rootDataService: inject(ProcurementContractHeaderDataService),
			prcItemService: inject(ProcurementContractItemDataService),
			module: ProcurementModuleUpdatePriceWizard.Contract
		});
	}
}