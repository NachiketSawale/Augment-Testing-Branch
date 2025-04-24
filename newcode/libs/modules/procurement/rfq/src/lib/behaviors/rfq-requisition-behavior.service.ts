/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IRfqRequisitionEntity } from '../model/entities/rfq-requisition-entity.interface';
import { ProcurementRfqRequisitionDataService } from '../services/rfq-requisition-data.service';

/**
 * Rfq requisition behavior
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqRequisitionGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IRfqRequisitionEntity>, IRfqRequisitionEntity> {
	private readonly dataService: ProcurementRfqRequisitionDataService;

	public constructor() {
		this.dataService = inject(ProcurementRfqRequisitionDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IRfqRequisitionEntity>) {

	}
}