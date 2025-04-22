/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';
import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';
import { ProcurementQuoteHeaderValidationService } from '../validations/quote-header-validation.service';
import { Rubric } from '@libs/basics/shared';


@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IQuoteHeaderEntity, QuoteHeaderEntityComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityQuote',
			moduleInternalName: ProcurementInternalModule.Quote,
			rootDataService: inject(ProcurementQuoteHeaderDataService),
			rootValidationService: inject(ProcurementQuoteHeaderValidationService),
			getConfigurationFK: (entity) => entity.PrcHeaderEntity?.ConfigurationFk,
			isUpdateHeaderTexts: true,
			showBillingSchema: true,
			rubricFk: Rubric.Quotation
		});
	}

}