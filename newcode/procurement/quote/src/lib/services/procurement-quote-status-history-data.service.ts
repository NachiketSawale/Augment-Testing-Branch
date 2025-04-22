/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BasicsSharedSatusHistoryDataService, IStatusHistoryEntity } from '@libs/basics/shared';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { IQuoteHeaderEntity, QuoteHeaderEntityComplete } from '../model';
/**
 * Represents the data service to handle Procurement Quote Status History Data Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteStatusHistoryDataService extends BasicsSharedSatusHistoryDataService<IStatusHistoryEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor( public quoteHeaderService:ProcurementQuoteHeaderDataService) {
		super(quoteHeaderService);
	}
	protected getModuleName(): string {
        return 'quote';
    }
}
