/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity, IConItemEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { IProcurementCommonReplaceNeutralMaterialWizardService, ProcurementModuleReplaceNeutralMaterialWizard } from '@libs/procurement/common';
import { ProcurementContractItemDataService } from '../services/procurement-contract-item-data.service';
import { ConItemComplete } from '../model/con-item-complete.class';


@Injectable({
	providedIn: 'root'
})
export class ProcurementContractReplaceNeutralMaterialWizardService extends IProcurementCommonReplaceNeutralMaterialWizardService<IConHeaderEntity, ContractComplete, IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityContract',
			currentModuleTranslationKey: 'procurement.common.wizard.replaceNeutralMaterial.currentContract',
			leadsFromProjectTranslationKey: 'procurement.common.wizard.replaceNeutralMaterial.allFromContract',
			rootDataService: inject(ProcurementContractHeaderDataService),
			prcItemService: inject(ProcurementContractItemDataService),
			module: ProcurementModuleReplaceNeutralMaterialWizard.Contract,
			getCompanyFk: (entity: IConHeaderEntity) => entity.CompanyFk,
			getTaxCodeFk: (entity: IConHeaderEntity) => entity.TaxCodeFk,
			getBpdVatGroupFk: (entity: IConHeaderEntity) => entity.BpdVatGroupFk ?? undefined,
		});
	}
}