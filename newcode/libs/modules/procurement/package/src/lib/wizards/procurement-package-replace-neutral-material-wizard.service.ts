/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IProcurementCommonReplaceNeutralMaterialWizardService, ProcurementModuleReplaceNeutralMaterialWizard } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackageItemDataService } from '../services/procurement-package-item-data.service';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageReplaceNeutralMaterialWizardService extends IProcurementCommonReplaceNeutralMaterialWizardService<IPrcPackageEntity, PrcPackageCompleteEntity, IPackageItemEntity, PackageItemComplete, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

	public constructor() {

		super({
			moduleNameTranslationKey: 'cloud.common.entityPackage',
			currentModuleTranslationKey: 'procurement.common.wizard.replaceNeutralMaterial.currentPackage',
			leadsFromProjectTranslationKey: 'procurement.common.wizard.replaceNeutralMaterial.allFromPackage',
			rootDataService: inject(ProcurementPackageHeaderDataService),
			prcItemService: inject(ProcurementPackageItemDataService),
			module: ProcurementModuleReplaceNeutralMaterialWizard.Package,
			getCompanyFk: (entity: IPrcPackageEntity) => entity.CompanyFk,
			getTaxCodeFk: (entity: IPrcPackageEntity) => entity.TaxCodeFk,
			getBpdVatGroupFk: (entity: IPrcPackageEntity) => entity.BpdVatGroupFk,
		});
	}
}