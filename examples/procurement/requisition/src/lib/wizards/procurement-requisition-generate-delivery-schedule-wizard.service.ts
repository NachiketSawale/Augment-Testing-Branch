/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonGenerateDeliveryScheduleWizardService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { RequisitionItemsDataService } from '../services/requisition-items-data.service';

/**
 * Procurement Requisition Generate Delivery Schedule Wizard Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionGenerateDeliveryScheduleWizardService extends ProcurementCommonGenerateDeliveryScheduleWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, IReqItemEntity, ReqItemComplete, object, object> {

	public constructor() {

		super({
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			prcItemService: inject(RequisitionItemsDataService),
			getInitStartDate: entity => entity.DateDelivery ? new Date(entity.DateDelivery) : new Date()
		});
	}
}
