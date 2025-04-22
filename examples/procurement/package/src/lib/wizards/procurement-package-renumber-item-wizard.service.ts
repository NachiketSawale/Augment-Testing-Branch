/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonRenumberItemWizardService, } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageRenumberItemWizardService
	extends ProcurementCommonRenumberItemWizardService<IPrcPackageEntity, PrcPackageCompleteEntity> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
			moduleInternalName: ProcurementInternalModule.Package
		});
	}
}