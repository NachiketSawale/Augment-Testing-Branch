/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonUpdateItemPriceWizardService, ProcurementModuleUpdatePriceWizard } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackageItemDataService } from '../services/procurement-package-item-data.service';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
/**
 * Procurement Package Update Item Price Wizard Service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageUpdateItemPriceWizardService extends ProcurementCommonUpdateItemPriceWizardService<IPrcPackageEntity, PrcPackageCompleteEntity, IPackageItemEntity, PackageItemComplete, IPackage2HeaderEntity, PrcPackage2HeaderComplete > {
	public constructor() {
		super({
			moduleNameTranslationKey: 'cloud.common.entityPackage',
			rootDataService: inject(ProcurementPackageHeaderDataService),
			prcItemService: inject(ProcurementPackageItemDataService),
			module: ProcurementModuleUpdatePriceWizard.Package
		});
	}
}