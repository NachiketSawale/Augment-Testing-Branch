/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonMaintainPaymentScheduleVersionWizardService } from '@libs/procurement/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { Package2HeaderDataService } from '../services/package-2header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageMaintainPaymentScheduleVersionWizardService extends ProcurementCommonMaintainPaymentScheduleVersionWizardService<IPrcPackageEntity, PrcPackageCompleteEntity> {
	private readonly package2HeaderService = inject(Package2HeaderDataService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
		});
	}

	protected override getHeaderContext() {
		const context = this.config.rootDataService.getHeaderContext();
		const subPackage = this.package2HeaderService.getSelectedEntity();

		if (subPackage) {
			context.prcHeaderFk = subPackage.PrcHeaderFk;
		}
		return context;
	}

	protected override async startWizardValidate(): Promise<boolean> {
		const result = await super.startWizardValidate();
		if (!result) {
			return result;
		}
		const subPackage = this.package2HeaderService.getSelectedEntity();

		if (!subPackage || subPackage?.PrcHeaderFk <= 0) {
			await this.messageBoxService.showMsgBox(this.translateService.instant('procurement.common.wizard.noPaymentScheduleVersion').text, 'procurement.common.wizard.noItemSelectedTitle', 'ico-error');
			return false;
		}
		return true;
	}
}
