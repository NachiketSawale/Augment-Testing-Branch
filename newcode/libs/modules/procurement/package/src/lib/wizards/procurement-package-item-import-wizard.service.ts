/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { MODULE_INFO_PROCUREMENT, ProcurementCommonItemExcelImportService, ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemExcelImportWizardService extends ProcurementCommonWizardBaseService<IPrcPackageEntity, PrcPackageCompleteEntity, IPrcPackageEntity> {
	protected readonly itemImportService = inject(ProcurementCommonItemExcelImportService);
	protected readonly package2HeaderService = inject(Package2HeaderDataService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService)
		});
	}

	protected override async showWizardDialog() {
		const entity = this.config.rootDataService.getSelectedEntity();
		const subEntity = this.package2HeaderService.getSelectedEntity();
		await this.itemImportService.showImportDialog({
			PrcHeaderFk: subEntity?.PrcHeaderFk,
			BpdVatGroupFk: entity?.BpdVatGroupFk,
			HeaderTaxCodeFk: entity?.TaxCodeFk,
			MainId: entity?.Id,
			SubMainId: subEntity?.Id,
			moduleName: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName
		});
		return undefined;
	}
}