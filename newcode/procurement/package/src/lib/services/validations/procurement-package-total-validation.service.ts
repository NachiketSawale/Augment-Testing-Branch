/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalValidationService } from '@libs/procurement/common';
import { inject, Injectable } from '@angular/core';
import { IPrcPackageTotalEntity } from '../../model/entities/procurement-package-total-entity.interface';
import { ProcurementPackageTotalDataService } from '../package-total-data.service';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../../model/entities/package-complete-entity.class';

/**
 * Contract total validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageTotalValidationService extends ProcurementCommonTotalValidationService<IPrcPackageTotalEntity, IPrcPackageEntity, PrcPackageCompleteEntity> {

	public constructor() {
		const dataService = inject(ProcurementPackageTotalDataService);

		super(dataService);
	}

}