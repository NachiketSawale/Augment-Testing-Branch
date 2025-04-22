/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonEnhanceBidderSearchWizardService, } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionEnhancedBidderSearchWizardService
	extends ProcurementCommonEnhanceBidderSearchWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, object, object> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			getWizardInitialEntity(entity) {
				return {
					structureFk: entity.PrcHeaderEntity?.StructureFk,
					prcHeaderFk: entity.PrcHeaderEntity?.Id,
					addressFk: entity.AddressFk,
					projectFk: entity.ProjectFk,
					companyFk: entity.CompanyFk,
					moduleName:ProcurementInternalModule.Requisition,
				};
			},
		});
	}
}