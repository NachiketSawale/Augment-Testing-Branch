/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { MODULE_INFO_PROCUREMENT, ProcurementCommonItemExcelImportService, ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemExcelImportWizardService extends ProcurementCommonWizardBaseService<IReqHeaderEntity, ReqHeaderCompleteEntity, IReqHeaderEntity> {
	protected readonly itemImportService = inject(ProcurementCommonItemExcelImportService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementRequisitionHeaderDataService)
		});
	}

	protected override async showWizardDialog() {
		const entity = this.config.rootDataService.getSelectedEntity();
		await this.itemImportService.showImportDialog({
			PrcHeaderFk: entity?.PrcHeaderFk,
			BpdVatGroupFk: entity?.BpdVatGroupFk,
			HeaderTaxCodeFk: entity?.TaxCodeFk,
			MainId: entity?.Id,
			moduleName: MODULE_INFO_PROCUREMENT.ProcurementRequisitionModuleName
		});
		return undefined;
	}
}