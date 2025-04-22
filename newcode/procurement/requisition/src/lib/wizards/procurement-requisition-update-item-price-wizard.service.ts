/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonUpdateItemPriceWizardService, ProcurementModuleUpdatePriceWizard } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { RequisitionItemsDataService } from '../services/requisition-items-data.service';

/**
 * Procurement Requisition Update Item Price Wizard Service.
 */

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionUpdateItemPriceWizardService extends ProcurementCommonUpdateItemPriceWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		super({
			moduleNameTranslationKey: 'cloud.common.entityRequisition',
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			prcItemService: inject(RequisitionItemsDataService),
			module: ProcurementModuleUpdatePriceWizard.Requisition,
		});
	}
}
