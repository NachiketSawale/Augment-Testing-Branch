/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementCommonExportMaterialWizardService } from '@libs/procurement/common';

@Injectable({ providedIn: 'root' })
export class ProcurementPackageExportMaterialWizardService extends ProcurementCommonExportMaterialWizardService<IPrcPackageEntity, PrcPackageCompleteEntity, IPackage2HeaderEntity>{

	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
			currentSelectionSvc: inject(Package2HeaderDataService),
			GetExportParameters(entity, rootEntity) {
				return {
					objectFk: entity.PrcPackageFk,
					ProjectFk: rootEntity.ProjectFk,
					CurrencyFk: rootEntity.CurrencyFk,
					moduleName: ProcurementInternalModule.Package,
					subObjectFk: entity.Id,
				};
			},
		});
	}
}