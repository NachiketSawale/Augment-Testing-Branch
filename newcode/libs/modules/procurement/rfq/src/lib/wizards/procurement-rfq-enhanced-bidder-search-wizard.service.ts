/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonEnhanceBidderSearchWizardService, } from '@libs/procurement/common';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { ProcurementRfqHeaderMainDataService } from '../services/procurement-rfq-header-main-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';


@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqEnhancedBidderSearchWizardService
	extends ProcurementCommonEnhanceBidderSearchWizardService<IRfqHeaderEntity, RfqHeaderEntityComplete, object, object> {
	public constructor() {
		super({
			rootDataService: inject(ProcurementRfqHeaderMainDataService),
			getWizardInitialEntity(entity) {
				return {
					structureFk: entity.PrcHeaderInstance?.StructureFk,
					projectFk: entity.ProjectFk,
					companyFk: entity.CompanyFk,
					rfqHeaderFk: entity.Id,
					moduleName: ProcurementInternalModule.Rfq,
				};
			},
			url: 'procurement/rfq/businesspartner/createrfqbusinesspartner',
		});
	}

}