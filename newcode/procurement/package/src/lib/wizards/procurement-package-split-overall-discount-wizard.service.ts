import { ProcurementCommonSplitOverallDiscountWizardService } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { inject, Injectable } from '@angular/core';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageSplitOverallDiscountWizardService extends ProcurementCommonSplitOverallDiscountWizardService<IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
			apiUrl: 'procurement/package/package/splitoveralldiscount',
		});
	}
}