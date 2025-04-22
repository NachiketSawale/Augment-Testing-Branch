/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonGenerateDeliveryScheduleWizardService } from '@libs/procurement/common';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { PrcPackage2HeaderComplete } from '../model/entities/package-2header-complete.class';
import { IPackage2HeaderEntity } from '@libs/procurement/interfaces';
import { Package2HeaderDataService } from '../services/package-2header-data.service';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageGenerateDeliveryScheduleWizardService extends ProcurementCommonGenerateDeliveryScheduleWizardService<IPrcPackageEntity, PrcPackageCompleteEntity, IPackageItemEntity, PackageItemComplete, IPackage2HeaderEntity, PrcPackage2HeaderComplete> {

	public constructor() {

		super({
			rootDataService: inject(ProcurementPackageHeaderDataService),
			multipleOptions: true,
			subDataService: inject(Package2HeaderDataService),
			getActivityFk: entity => entity.ActivityFk,
			getSubPrcHeaderFk: subEntity => subEntity?.PrcHeaderFk,
			getInitStartDate: entity => entity.DateDelivery ? new Date(entity.DateDelivery) : new Date(),
		});
	}
}
