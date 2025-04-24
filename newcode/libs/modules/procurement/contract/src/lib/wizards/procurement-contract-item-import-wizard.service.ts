/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IConHeaderEntity } from '../model/entities';
import { MODULE_INFO_PROCUREMENT, ProcurementCommonItemExcelImportService, ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementContractItemExcelImportWizardService extends ProcurementCommonWizardBaseService<IConHeaderEntity, ContractComplete, IConHeaderEntity> {
	protected readonly itemImportService = inject(ProcurementCommonItemExcelImportService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService)
		});
	}

	protected override async showWizardDialog() {
		const entity = this.config.rootDataService.getSelectedEntity();
		await this.itemImportService.showImportDialog({
			PrcHeaderFk: entity?.PrcHeaderFk,
			BpdVatGroupFk: entity?.BpdVatGroupFk,
			HeaderTaxCodeFk: entity?.TaxCodeFk,
			MainId: entity?.Id,
			moduleName: MODULE_INFO_PROCUREMENT.ProcurementContractModuleName
		});
		return undefined;
	}
}