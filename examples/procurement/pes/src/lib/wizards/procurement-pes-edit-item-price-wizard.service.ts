/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IPesHeaderEntity } from '../model/entities';
import { ProcurementPesHeaderDataService } from '../services/procurement-pes-header-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { ProcurementPesItemDataService } from '../services/procurement-pes-item-data.service';
import { PesCompleteNew } from '../model/complete-class/pes-complete-new.class';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesEditItemPriceWizardService extends ProcurementCommonWizardBaseService<IPesHeaderEntity, PesCompleteNew, object> {
	private readonly companyLookupService = ServiceLocator.injector.get(BasicsCompanyLookupService);

	public constructor(protected dataService:ProcurementPesItemDataService) {
		super({
			rootDataService: inject(ProcurementPesHeaderDataService),
		});
	}

	protected override async showWizardDialog() {
		return this.messageBoxService.showMsgBox('procurement.pes.wizard.alreadyEditItemPrice', 'procurement.pes.wizard.editItemPrice', 'ico-info');
	}

	protected override async onFinishWizard(): Promise<void> {
		const pesItem = this.dataService.getSelectedEntity();
		if(pesItem) {
			this.dataService.setEntityReadOnlyFields(pesItem, [
				{field: 'Price', readOnly: false},
				{field: 'PriceOc', readOnly: false},
				{field: 'PriceGross', readOnly: false},
				{field: 'PriceGrossOc', readOnly: false},
				{field: 'TotalGross', readOnly: !this.IsReadOnlyByCalculateOverGross()},
				{field: 'TotalGrossOc', readOnly: !this.IsReadOnlyByCalculateOverGross()},
			]);
		}
	}

	private IsReadOnlyByCalculateOverGross() {
		const companyEntity = this.companyLookupService.cache.getItem({ id: this.configService.clientId! });
		if (companyEntity) {
			return companyEntity.IsCalculateOverGross;
		}
		return false;
	}
}
