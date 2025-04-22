/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { ProcurementPriceComparisonBusinessPartnerDataService } from './business-partner-data.service';

export class PriceComparisonBusinessPartnerReadonlyProcessorService extends EntityReadonlyProcessorBase<IBusinessPartnerEntity> {
	public constructor(protected dataService: ProcurementPriceComparisonBusinessPartnerDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IBusinessPartnerEntity> {
		return {};
	}

	protected override readonlyEntity() {
		return false;
	}
}