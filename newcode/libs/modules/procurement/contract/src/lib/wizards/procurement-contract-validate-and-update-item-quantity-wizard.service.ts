/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonItemQuantityUpdateWizardService } from '@libs/procurement/common';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
@Injectable({ providedIn: 'root' })
export class ProcurementContractValidateAndUpdateItemQuantityWizardService {
    private readonly wizardService = inject(ProcurementCommonItemQuantityUpdateWizardService);
    private readonly dataService = inject(ProcurementContractHeaderDataService);
    public showDialog() {
        const config = {
            dataService: this.dataService,
            validateUrl: 'procurement/contract/header/ValidateAndUpdateItemQuantity',
            defaultSelectedItemId: 'currentLeadingRecord',
            itemsSource: [
                { id: 'currentLeadingRecord', displayName: 'procurement.common.wizard.forCurrentLeadingRecord'},
                { id: 'currentPackage', displayName: 'procurement.common.wizard.forCurrentPackage'},
                { id: 'currentProject', displayName: 'procurement.common.wizard.forCurrentProject'},
            ],
        };
        this.wizardService.showDialog(config);
    }
}