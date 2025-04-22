/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService } from '@libs/documents/shared';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';


@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteDocumentProjectDataService extends DocumentProjectDataRootService<IQuoteHeaderEntity> {
	protected readonly parentService: ProcurementQuoteHeaderDataService;

	public constructor() {
		const parentDataService = inject(ProcurementQuoteHeaderDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

}
