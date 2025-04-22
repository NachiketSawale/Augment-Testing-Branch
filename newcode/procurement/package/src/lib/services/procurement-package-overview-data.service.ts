/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonOverviewEntity, ProcurementCommonOverviewDataHelperService, ProcurementCommonOverviewDataService, ProcurementOverviewSearchlevel } from '@libs/procurement/common';
import { ProcurementModule } from '@libs/procurement/shared';
import { CompleteIdentification } from '@libs/platform/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';

/**
 * Overview service in contract
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageOverviewDataService extends ProcurementCommonOverviewDataService<IProcurementCommonOverviewEntity, CompleteIdentification<IProcurementCommonOverviewEntity>, IPrcPackageEntity, PrcPackageCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementPackageHeaderDataService);
		const moduleInfoEntities = new ProcurementCommonOverviewDataHelperService();
		super(parentService, {
			moduleName: ProcurementModule.Package.toLowerCase(),
			entityInfo: moduleInfoEntities.getPackageOverviewContainerList(),
			searchLevel: ProcurementOverviewSearchlevel.RootContainer,
		});
	}
}
