/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedHistoricalPriceForBoqDataService } from '@libs/basics/shared';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * Represents the data service to handle package historical price for boq.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHistoricalPriceForBoqDataService extends BasicsSharedHistoricalPriceForBoqDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
	public constructor() {
		const packageHeaderService = inject(ProcurementPackageHeaderDataService);
		//TODO: Boq not is done yet, replace the parentService after Boq is done.
		super(packageHeaderService, packageHeaderService);
	}
}
