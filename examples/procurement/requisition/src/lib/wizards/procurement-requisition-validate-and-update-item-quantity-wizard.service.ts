/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { ProcurementCommonItemQuantityUpdateWizardService } from '@libs/procurement/common';
@Injectable({ providedIn: 'root' })
export class ProcurementRequisitionValidateAndUpdateItemQuantityWizardService {
    private readonly wizardService = inject(ProcurementCommonItemQuantityUpdateWizardService);
    private readonly dataService = inject(ProcurementRequisitionHeaderDataService);
    public showDialog() {
        const config = {
            dataService: this.dataService,
            validateUrl: 'procurement/requisition/requisition/ValidateAndUpdateItemQuantity',
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