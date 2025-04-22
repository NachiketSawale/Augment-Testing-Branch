/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonItemQuantityUpdateWizardService } from '@libs/procurement/common';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
@Injectable({ providedIn: 'root' })
export class ProcurementQuoteValidateAndUpdateItemQuantityWizardService {
    private readonly wizardService = inject(ProcurementCommonItemQuantityUpdateWizardService);
    private readonly dataService = inject(ProcurementQuoteHeaderDataService);
    public showDialog() {
        const config = {
            dataService: this.dataService,
            validateUrl:'procurement/quote/header/ValidateAndUpdateItemQuantity',
            defaultSelectedItemId: 'currentLeadingRecord',
            itemsSource: [
                { id: 'currentLeadingRecord', displayName: 'cloud.common.forCurrentLeadingRecord'},
                { id: 'currentPackage', displayName: 'cloud.common.forCurrentPackage'},
                { id: 'currentProject', displayName: 'cloud.common.forCurrentProject'},
            ],
        };
        this.wizardService.showDialog(config);
    }
}