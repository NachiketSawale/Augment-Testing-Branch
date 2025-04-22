/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model//entities/rfq-header-entity-complete.class';
import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { RfqHeaderValidationService } from '../services/validations/procurement-rfq-header-validation.service';
import { Rubric } from '@libs/basics/shared';


@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IRfqHeaderEntity, RfqHeaderEntityComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityRfQ',
			moduleInternalName: ProcurementInternalModule.Rfq,
			rootDataService: inject(ProcurementRfqHeaderMainDataService),
			rootValidationService: inject(RfqHeaderValidationService),
			getConfigurationFK: (entity) => entity.PrcConfigurationFk,
			isUpdateHeaderTexts: true,
			showBillingSchema: true,
			rubricFk: Rubric.RFQs
		});
	}

}