/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQuoteRequisitionEntity } from '../model/entities/quote-requisition-entity.interface';
import { ProcurementQuoteRequisitionDataService } from '../services/quote-requisitions-data.service';

/**
 * Quote requisition behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteRequisitionGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IQuoteRequisitionEntity>, IQuoteRequisitionEntity> {
	private dataService: ProcurementQuoteRequisitionDataService;

	public constructor() {
		this.dataService = inject(ProcurementQuoteRequisitionDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IQuoteRequisitionEntity>) {

	}
}