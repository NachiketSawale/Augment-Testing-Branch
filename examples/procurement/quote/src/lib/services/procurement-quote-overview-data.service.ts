/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonOverviewEntity, ProcurementCommonOverviewDataHelperService, ProcurementCommonOverviewDataService, ProcurementOverviewSearchlevel } from '@libs/procurement/common';
import { ProcurementModule } from '@libs/procurement/shared';
import { CompleteIdentification } from '@libs/platform/common';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';

/**
 * Overview service in quote
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteOverviewDataService extends ProcurementCommonOverviewDataService<IProcurementCommonOverviewEntity, CompleteIdentification<IProcurementCommonOverviewEntity>, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor() {
		const parentService = inject(ProcurementQuoteHeaderDataService);
		const moduleInfoEntities = new ProcurementCommonOverviewDataHelperService();
		super(parentService, {
			moduleName: ProcurementModule.Quote.toLowerCase(),
			entityInfo: moduleInfoEntities.getQuoteOverviewContainerList(),
			searchLevel: ProcurementOverviewSearchlevel.RootContainer,
		});
	}
}