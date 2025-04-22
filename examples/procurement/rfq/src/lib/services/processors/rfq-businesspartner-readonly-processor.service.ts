/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { IRfqBusinessPartnerEntity } from '../../model/entities/rfq-businesspartner-entity.interface';
import { ProcurementRfqBusinessPartnerDataService } from '../rfq-business-partner-data.service';

export class ProcurementRfqBusinesspartnerReadonlyProcessorService extends EntityReadonlyProcessorBase<IRfqBusinessPartnerEntity> {
	public constructor(
		private readonly dataService: ProcurementRfqBusinessPartnerDataService
	) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IRfqBusinessPartnerEntity> {
		return {
			SubsidiaryFk: (info: ReadonlyInfo<IRfqBusinessPartnerEntity>) => info.item.BusinessPartnerFk <= 0
		};
	}
}