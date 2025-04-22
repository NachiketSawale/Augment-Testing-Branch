/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ProcurementContractHeaderValidationService } from '../services/procurement-contract-header-validation.service';
import { Rubric } from '@libs/basics/shared';


@Injectable({
	providedIn: 'root'
})
export class ProcurementContractChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IConHeaderEntity, ContractComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityContract',
			moduleInternalName: ProcurementInternalModule.Contract,
			rootDataService: inject(ProcurementContractHeaderDataService),
			rootValidationService: inject(ProcurementContractHeaderValidationService),
			getConfigurationFK: (entity) => entity.PrcHeaderEntity?.ConfigurationFk,
			getBillingSchemaFk: (entity) => entity.BillingSchemaFk,
			isUpdateHeaderTexts: true,
			showBillingSchema: true,
			rubricFk: Rubric.Contract
		});
	}

}