/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { Rubric } from '@libs/basics/shared';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { ProcurementPesHeaderValidationService } from '../services/validations/procurement-pes-header-validation.service';



@Injectable({
	providedIn: 'root'
})
export class ProcurementPesChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IPesHeaderEntity, PesCompleteNew> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'procurement.pes.titlePes',
			moduleInternalName: ProcurementInternalModule.Pes,
			rootDataService: inject(ProcurementPesHeaderDataService),
			rootValidationService: inject(ProcurementPesHeaderValidationService),
			getConfigurationFK: (entity) => entity.PrcConfigurationFk,
			getBillingSchemaFk: (entity) => entity.BillingSchemaFk ?? undefined ,
			isUpdateHeaderTexts: false,
			showBillingSchema: true,
			rubricFk: Rubric.PerformanceEntrySheets
		});
	}

}