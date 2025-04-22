/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {IPrcDocumentEntity, ProcurementCommonDocumentDataService} from '@libs/procurement/common';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { IQuoteHeaderEntity } from '../model';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';

@Injectable({
    providedIn: 'root'
})
export class ProcurementQuoteDocumentDataService extends ProcurementCommonDocumentDataService<IPrcDocumentEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete>{
    public constructor() {
        const quoteDataService = inject(ProcurementQuoteHeaderDataService);
        super(quoteDataService,{});
    }

	public override isParentFn(parentKey: IQuoteHeaderEntity, entity: IPrcDocumentEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}