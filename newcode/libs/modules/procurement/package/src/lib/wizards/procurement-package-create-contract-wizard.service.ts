/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonCreateContractWizardService, ProcurementCreateContractMode } from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageCreateContractWizardService {
	public readonly procurementCommonCreateContractWizardService = inject(ProcurementCommonCreateContractWizardService);

	public async createContract() {
		await this.procurementCommonCreateContractWizardService.createContract(ProcurementCreateContractMode.Package);
	}
}
