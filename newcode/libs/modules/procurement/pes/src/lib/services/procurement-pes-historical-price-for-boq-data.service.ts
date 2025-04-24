/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedHistoricalPriceForBoqDataService } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from './procurement-pes-header-data.service';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';

/**
 * Represents the data service to handle pes historical price for boq.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPesHistoricalPriceForBoqDataService extends BasicsSharedHistoricalPriceForBoqDataService<IEntityIdentification, CompleteIdentification<IEntityIdentification>> {

	public constructor() {
		const pesHeaderService = inject(ProcurementPesHeaderDataService);
		// TODO: Boq not is done yet, replace the parentService after Boq is done.(same about prcPackage)
		super(pesHeaderService, pesHeaderService);
	}
}