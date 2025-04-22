/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonCreateRfqWizardService } from '@libs/procurement/common';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IBusinessPartner2CreateRfqWizardResult } from '@libs/businesspartner/shared';
import { ProcurementInternalModule } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageCreateRfqWizardService
	extends ProcurementCommonCreateRfqWizardService<IPrcPackageEntity, PrcPackageCompleteEntity, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
			subDataService: inject(Package2HeaderDataService),
			getWizardInitialEntity(entity, subEntity) {
				return {
					structureFk: subEntity?.PrcHeaderEntity?.StructureFk,
					prcHeaderFk: subEntity?.PrcHeaderEntity?.Id,
					addressFk: entity.AddressFk,
					projectFk: entity.ProjectFk,
					companyFk: entity.CompanyFk,
					headerFk: entity.Id,
					moduleName:ProcurementInternalModule.Package,
				};
			},
			url: 'procurement/rfq/header/createfrompackage'
		});
	}

	protected processExecuteWizard(dialogResult: IBusinessPartner2CreateRfqWizardResult): void {
		if (this.wizardInitialEntity?.headerFk) {
			dialogResult.PackageId = this.wizardInitialEntity.headerFk;
		}

	}
}