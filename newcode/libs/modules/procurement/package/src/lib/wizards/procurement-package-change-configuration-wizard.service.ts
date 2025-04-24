import { ProcurementCommonChangeConfigurationWizardService } from '@libs/procurement/common';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { inject, Injectable } from '@angular/core';
import { Rubric } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackageHeaderValidationService } from '../services/validations/package-header-validation.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageChangeConfigurationWizardService extends ProcurementCommonChangeConfigurationWizardService<IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor() {
		super({
			moduleNameTranslationKey: 'cloud.common.entityPackage',
			moduleInternalName: ProcurementInternalModule.Package,
			rootDataService: inject(ProcurementPackageHeaderDataService),
			rootValidationService: inject(ProcurementPackageHeaderValidationService),
			getConfigurationFK: (entity) => entity.ConfigurationFk,
			isUpdateHeaderTexts: true,
			showBillingSchema: true,
			rubricFk: Rubric.Package,
		});
	}
}
