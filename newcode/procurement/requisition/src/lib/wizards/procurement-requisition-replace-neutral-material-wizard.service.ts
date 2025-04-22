/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IProcurementCommonReplaceNeutralMaterialWizardService, ProcurementModuleReplaceNeutralMaterialWizard } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { ReqItemComplete } from '../model/req-item-complete.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { RequisitionItemsDataService } from '../services/requisition-items-data.service';

/**
 * Procurement Requisition Replace Neutral Material Wizard Service.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionReplaceNeutralMaterialWizardService extends IProcurementCommonReplaceNeutralMaterialWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, IReqItemEntity, ReqItemComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityRequisition',
			currentModuleTranslationKey: 'procurement.common.wizard.replaceNeutralMaterial.currentRequsition',
			leadsFromProjectTranslationKey: 'procurement.common.wizard.replaceNeutralMaterial.allFromRequisition',
			rootDataService: inject(ProcurementRequisitionHeaderDataService),
			prcItemService: inject(RequisitionItemsDataService),
			module: ProcurementModuleReplaceNeutralMaterialWizard.Requisition,
			getCompanyFk: (entity: IReqHeaderEntity) => entity.CompanyFk,
			getTaxCodeFk: (entity: IReqHeaderEntity) => entity.TaxCodeFk,
			getBpdVatGroupFk: (entity: IReqHeaderEntity) => entity.BpdVatGroupFk === null ? undefined : entity.BpdVatGroupFk,
		});
	}
}