import { inject, Injectable } from '@angular/core';
import { ProcurementCommonSplitOverallDiscountWizardService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';


@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitioinSplitOverallDiscountWizardService extends ProcurementCommonSplitOverallDiscountWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity>{
	public constructor() {
		super({
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			apiUrl: 'procurement/requisition/requisition/splitoveralldiscount',
		});
	}
}