/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonSetBaseAlternateItemWizardService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { RequisitionItemsDataService } from '../services/requisition-items-data.service';
import { RequisitionItemValidationService } from '../services/validations/requisition-item-validation.service';


@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionSetBaseAltItemWizardService extends ProcurementCommonSetBaseAlternateItemWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {

		super({
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			prcItemService: inject(RequisitionItemsDataService),
			prcItemValidationService: inject(RequisitionItemValidationService)
		});
	}

}