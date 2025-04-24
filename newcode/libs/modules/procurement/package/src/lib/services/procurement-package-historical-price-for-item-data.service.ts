/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { ProcurementPackageItemDataService } from './procurement-package-item-data.service';
import { BasicsSharedHistoricalPriceForItemDataService } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * HistoricalPriceForItem service in Package
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageHistoricalPriceForItemDataService extends BasicsSharedHistoricalPriceForItemDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementPackageItemDataService);
		const headerService = inject(ProcurementPackageHeaderDataService);
		super(parentService, headerService);
	}
}
