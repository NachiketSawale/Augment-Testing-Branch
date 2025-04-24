/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { RequisitionTotalDataService } from '../requisition-total-data.service';
import { IReqHeaderEntity } from '../../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../../model/entities/requisition-complete-entity.class';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

/**
 * Requisition total validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionTotalValidationService extends ProcurementCommonTotalValidationService<IPrcCommonTotalEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	protected checkUniqueTotalTypeRoute: string = 'procurement/requisition/total/';

	public constructor() {
		const dataService = inject(RequisitionTotalDataService);

		super(dataService);
	}

}